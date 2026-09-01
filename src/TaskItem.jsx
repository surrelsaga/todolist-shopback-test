import { useState } from 'react'
import { NO_CATEGORY_OPTION } from './constants.js'
import { isOverdue } from './dates.js'

export default function TaskItem({ task, categories, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [categoryId, setCategoryId] = useState(task.categoryId ?? '')
  const [dueDate, setDueDate] = useState(task.dueDate ?? '')

  function startEditing() {
    setTitle(task.title)
    setDescription(task.description)
    setCategoryId(task.categoryId ?? '')
    setDueDate(task.dueDate ?? '')
    setEditing(true)
  }

  function save(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onSave({
      title: trimmed,
      description: description.trim(),
      categoryId: categoryId || null,
      dueDate: dueDate || null,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="task editing">
        <form className="edit-form" onSubmit={save}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Edit title"
            autoFocus
          />
          <input
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details (optional)"
            aria-label="Edit description"
          />
          <label className="field">
            <span>Due</span>
            <input
              className="input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <div className="row-actions">
            <select
              className="input select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              aria-label="Edit category"
            >
              <option value="">{NO_CATEGORY_OPTION}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="btn" type="submit" disabled={!title.trim()}>
              Save
            </button>
            <button className="btn ghost" type="button" onClick={() => setEditing(false)}>
              Nevermind
            </button>
          </div>
        </form>
      </li>
    )
  }

  const done = task.status === 'complete'

  return (
    <li className={done ? 'task done' : 'task'}>
      <label className="check">
        <input type="checkbox" checked={done} onChange={onToggle} />
        <span className="box" aria-hidden="true" />
      </label>

      <div className="body" onDoubleClick={startEditing}>
        <p className="title">{task.title}</p>
        {task.description && <p className="desc">{task.description}</p>}
        <p className="meta">
          <span className={done ? 'pill done-pill' : 'pill'}>{done ? 'done' : 'to do'}</span>
          {task.dueDate && (
            <span className={isOverdue(task) ? 'pill late-pill' : 'pill due-pill'}>
              {isOverdue(task) ? '🔥 was due ' : 'due '}
              {task.dueDate}
            </span>
          )}
          <time dateTime={task.createdAt}>
            added {new Date(task.createdAt).toLocaleString()}
          </time>
        </p>
      </div>

      <div className="row-actions">
        <button className="btn ghost" onClick={startEditing} title="Edit">
          ✏️
        </button>
        <button className="btn ghost" onClick={onDelete} title="Move to bin">
          🗑️
        </button>
      </div>
    </li>
  )
}
