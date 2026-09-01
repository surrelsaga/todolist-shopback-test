// Due dates are plain 'YYYY-MM-DD' strings straight from <input type="date">.
// No parsing, no timezone drama: string comparison IS date comparison.

// 'sv-SE' is the one common locale that formats as YYYY-MM-DD, so this gives
// today in the user's own timezone without hand-rolling the offset maths.
export const todayISO = () => new Date().toLocaleDateString('sv')

export function addDays(iso, n) {
  const d = new Date(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const DUE_FILTERS = [
  ['any', 'Any'],
  ['overdue', 'Overdue'],
  ['today', 'Today'],
  ['week', 'Next 7 days'],
  ['none', 'No date'],
]

export function matchesDue(task, filter, today = todayISO()) {
  switch (filter) {
    // A finished task can't be late any more, so completed ones drop out.
    case 'overdue':
      return !!task.dueDate && task.dueDate < today && task.status !== 'complete'
    case 'today':
      return task.dueDate === today
    case 'week':
      return !!task.dueDate && task.dueDate >= today && task.dueDate <= addDays(today, 7)
    case 'none':
      return !task.dueDate
    default:
      return true
  }
}

export const isOverdue = (task, today = todayISO()) =>
  !!task.dueDate && task.dueDate < today && task.status !== 'complete'
