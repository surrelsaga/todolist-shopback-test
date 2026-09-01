import { UNGROUPED } from './constants.js'
import { matchesDue } from './dates.js'

export const ALL = 'all'

// An empty section is worth rendering only when its emptiness is news to the user.
function keepWhenEmpty(group, filter, dueFilter) {
  // They clicked into this one category — show the empty state, not a blank pane.
  if (filter === group.id) return true
  // Strays is implicit: it appears only when something is actually loose.
  if (group.id === null) return false
  // Nothing filtered, so a category you just made stays visible instead of
  // looking like it failed to save. Under any filter, empty means hidden.
  return dueFilter === 'any'
}

// The sections the task pane should render, each already carrying its own tasks.
export function buildGroups(categories, tasks, { filter = ALL, dueFilter = 'any' } = {}) {
  return [...categories, UNGROUPED]
    .filter((group) => filter === ALL || group.id === filter)
    .map((group) => ({
      ...group,
      tasks: tasks.filter((t) => t.categoryId === group.id && matchesDue(t, dueFilter)),
    }))
    .filter((group) => group.tasks.length > 0 || keepWhenEmpty(group, filter, dueFilter))
}
