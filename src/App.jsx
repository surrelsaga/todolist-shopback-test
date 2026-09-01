import { useEffect, useState } from 'react'
import TaskItem from './TaskItem.jsx'
import { UNGROUPED, NO_CATEGORY_OPTION } from './constants.js'
import { loadState, saveState } from './storage.js'

const EMPTY_LINE = 'Nothing here. Suspiciously peaceful.'
const ALL = 'all'
const saved = loadState()

export default function App() {
  const [tasks, setTasks] = useState(saved.tasks)
  const [categories, setCategories] = useState(saved.categories)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filter, setFilter] = useState(ALL)

  useEffect(() => {
    saveState({ tasks, categories })
  }, [tasks, categories])

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
        createdAt: new Date().toISOString(),
      },
      ...tasks,
    ])
    setTitle('')
    setDescription('')
  }

  function updateTask(id, changes) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id))
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
    if (!confirm(`Delete "${category.name}"? Its tasks become strays, not corpses.`)) return
    setCategories(categories.filter((c) => c.id !== category.id))
    setTasks(tasks.map((t) => (t.categoryId === category.id ? { ...t, categoryId: null } : t)))
    if (categoryId === category.id) setCategoryId('')
    if (filter === category.id) setFilter(ALL)
  }

  const done = tasks.filter((t) => t.status === 'complete').length
  const countIn = (id) => tasks.filter((t) => t.categoryId === id).length
  const groups = [...categories, UNGROUPED]
  const shownGroups = filter === ALL ? groups : groups.filter((g) => g.id === filter)

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
        {tasks.length === 0 ? (
          <p className="empty">{EMPTY_LINE}</p>
        ) : (
          shownGroups.map((group) => {
            const groupTasks = tasks.filter((t) => t.categoryId === group.id)
            if (filter === ALL && group.id === null && groupTasks.length === 0) return null
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
