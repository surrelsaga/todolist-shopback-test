import { useEffect, useState } from 'react'
import TaskItem from './TaskItem.jsx'
import { UNGROUPED, NO_CATEGORY_OPTION } from './constants.js'
import { loadState, saveState } from './storage.js'
import { DUE_FILTERS, matchesDue } from './dates.js'
import { buildGroups, ALL } from './groups.js'
import { toTrash, fromTrash, trashCategoryTasks } from './trash.js'

const EMPTY_LINE = 'Nothing here. Suspiciously peaceful.'
const saved = loadState()

export default function App() {
  const [tasks, setTasks] = useState(saved.tasks)
  const [categories, setCategories] = useState(saved.categories)
  const [trash, setTrash] = useState(saved.trash)
  const [showTrash, setShowTrash] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filter, setFilter] = useState(ALL)
  const [dueFilter, setDueFilter] = useState('any')

  useEffect(() => {
    saveState({ tasks, categories, trash })
  }, [tasks, categories, trash])

  function addTask(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks([
      {
        id: crypto.randomUUID(),
        title: trimmed,
        description: description.trim(),
        status: 'incomplete',
        categoryId: categoryId || null,
        dueDate: dueDate || null,
        createdAt: new Date().toISOString(),
      },
      ...tasks,
    ])
    setTitle('')
    setDescription('')
    setDueDate('')
  }

  function updateTask(id, changes) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  function deleteTask(id) {
    const task = tasks.find((t) => t.id === id)
    setTasks(tasks.filter((t) => t.id !== id))
    setTrash([toTrash(task), ...trash])
  }

  function restoreTask(id) {
    const task = trash.find((t) => t.id === id)
    setTrash(trash.filter((t) => t.id !== id))
    setTasks([fromTrash(task, categories), ...tasks])
  }

  function purgeTask(id) {
    setTrash(trash.filter((t) => t.id !== id))
  }

  function emptyTrash() {
    if (!confirm(`Permanently delete ${trash.length} task(s)? No take-backs this time.`)) return
    setTrash([])
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id)
    updateTask(id, { status: task.status === 'complete' ? 'incomplete' : 'complete' })
  }

  function addCategory(e) {
    e.preventDefault()
    const name = newCategory.trim()
    if (!name) return
    setCategories([...categories, { id: crypto.randomUUID(), name }])
    setNewCategory('')
  }

  // ponytail: prompt/confirm for rename + delete — native, zero extra state.
  // Swap for inline editing if the dialogs get in the way.
  function renameCategory(category) {
    const name = prompt('Call it what, then?', category.name)?.trim()
    if (!name) return
    setCategories(categories.map((c) => (c.id === category.id ? { ...c, name } : c)))
  }

  // Clicking the active row again clears the filter — no separate "all" row.
  function toggleFilter(id) {
    setFilter(filter === id ? ALL : id)
  }

  function deleteCategory(category) {
    const doomed = tasks.filter((t) => t.categoryId === category.id).length
    const fate = doomed === 0 ? 'It has no tasks.' : `Its ${doomed} task(s) go to the bin.`
    if (!confirm(`Delete "${category.name}"? ${fate}`)) return
    const next = trashCategoryTasks(tasks, trash, category.id)
    setCategories(categories.filter((c) => c.id !== category.id))
    setTasks(next.tasks)
    setTrash(next.trash)
    if (categoryId === category.id) setCategoryId('')
    if (filter === category.id) setFilter(ALL)
  }

  const done = tasks.filter((t) => t.status === 'complete').length
  // The due filter narrows everything downstream, sidebar counts included.
  const visible = tasks.filter((t) => matchesDue(t, dueFilter))
  const countIn = (id) => visible.filter((t) => t.categoryId === id).length
  const shownGroups = buildGroups(categories, tasks, { filter, dueFilter })

  return (
    <div className="app">
      <aside className="sidebar">
        <header className="header">
          <h1>
            Stuff To Do <span className="wobble">(allegedly)</span>
          </h1>
          <p className="score">
            {tasks.length === 0
              ? 'a blank slate, how brave'
              : `${done} of ${tasks.length} conquered`}
          </p>
        </header>

        <form className="card" onSubmit={addTask}>
          <p className="card-label">New task</p>
          <input
            className="input title-input"
            placeholder="What are you avoiding today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Task title"
          />
          <input
            className="input"
            placeholder="Details or excuses…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Task description"
          />
          <select
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            aria-label="Task category"
          >
            <option value="">{NO_CATEGORY_OPTION}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="field">
            <span>Due (optional)</span>
            <input
              className="input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <button className="btn add-btn" type="submit" disabled={!title.trim()}>
            Add it
          </button>
        </form>

        <nav className="card categories">
          <p className="card-label">
            Categories
            {filter !== ALL && (
              <button className="btn ghost tiny" onClick={() => setFilter(ALL)}>
                show all
              </button>
            )}
          </p>

          <form className="cat-form" onSubmit={addCategory}>
            <input
              className="input"
              placeholder="Work, Chores, Doom…"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              aria-label="New category name"
            />
            <button className="btn" type="submit" disabled={!newCategory.trim()}>
              Add
            </button>
          </form>

          <ul className="nav-list">
            {categories.map((c) => (
              <li className="nav-row" key={c.id}>
                <button
                  className={filter === c.id ? 'nav-btn active' : 'nav-btn'}
                  onClick={() => toggleFilter(c.id)}
                >
                  <span>{c.name}</span>
                  <span className="count">{countIn(c.id)}</span>
                </button>
                <button className="btn ghost tiny" onClick={() => renameCategory(c)} title="Rename">
                  ✏️
                </button>
                <button
                  className="btn ghost tiny"
                  onClick={() => deleteCategory(c)}
                  title="Delete category"
                >
                  ✖️
                </button>
              </li>
            ))}

            <li className="nav-row">
              <button
                className={filter === null ? 'nav-btn active' : 'nav-btn'}
                onClick={() => toggleFilter(null)}
              >
                <span>{UNGROUPED.name}</span>
                <span className="count">{countIn(null)}</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <div className="toolbar">
          {showTrash ? (
            <>
              <span className="toolbar-label">Bin</span>
              <button className="pill-btn danger" onClick={emptyTrash} disabled={trash.length === 0}>
                Empty the bin
              </button>
              <button className="pill-btn push" onClick={() => setShowTrash(false)}>
                ← Back to tasks
              </button>
            </>
          ) : (
            <>
              <span className="toolbar-label">Due</span>
              {DUE_FILTERS.map(([value, label]) => (
                <button
                  key={value}
                  className={dueFilter === value ? 'pill-btn active' : 'pill-btn'}
                  onClick={() => setDueFilter(value)}
                >
                  {label}
                </button>
              ))}
              <button className="pill-btn push" onClick={() => setShowTrash(true)}>
                🗑️ Bin <span className="count">{trash.length}</span>
              </button>
            </>
          )}
        </div>

        {showTrash ? (
          trash.length === 0 ? (
            <p className="empty">Bin's empty. Nothing to regret yet.</p>
          ) : (
            <ul className="list">
              {trash.map((task) => (
                <li className="task trashed" key={task.id}>
                  <div className="body">
                    <p className="title">{task.title}</p>
                    {task.description && <p className="desc">{task.description}</p>}
                    <p className="meta">
                      <time dateTime={task.deletedAt}>
                        binned {new Date(task.deletedAt).toLocaleString()}
                      </time>
                    </p>
                  </div>
                  <div className="row-actions">
                    <button
                      className="btn ghost"
                      onClick={() => restoreTask(task.id)}
                      title="Put it back"
                    >
                      ↩️
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => purgeTask(task.id)}
                      title="Delete forever"
                    >
                      💀
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : tasks.length === 0 ? (
          <p className="empty">{EMPTY_LINE}</p>
        ) : shownGroups.length === 0 ? (
          <p className="empty">Nothing due in that window. Lucky you.</p>
        ) : (
          shownGroups.map((group) => {
            const groupTasks = group.tasks
            return (
              <section className="group" key={group.id ?? 'ungrouped'}>
                <h2 className="group-title">
                  {group.name} <span className="count">{groupTasks.length}</span>
                </h2>
                {groupTasks.length === 0 ? (
                  <p className="group-empty">Empty. Enviable.</p>
                ) : (
                  <ul className="list">
                    {groupTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        categories={categories}
                        onToggle={() => toggleTask(task.id)}
                        onSave={(changes) => updateTask(task.id, changes)}
                        onDelete={() => deleteTask(task.id)}
                      />
                    ))}
                  </ul>
                )}
              </section>
            )
          })
        )}
      </main>
    </div>
  )
}
