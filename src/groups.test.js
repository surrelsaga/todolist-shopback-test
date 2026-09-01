// Run: npm test
import assert from 'node:assert/strict'
import { buildGroups, ALL } from './groups.js'

const TODAY = '2026-09-01'
const categories = [
  { id: 'work', name: 'Work' },
  { id: 'chores', name: 'Chores' },
]

let n = 0
const task = (categoryId, dueDate = null, status = 'incomplete') => ({
  id: `t${n++}`,
  title: 'a task',
  categoryId,
  dueDate,
  status,
})

const names = (groups) => groups.map((g) => g.name)

// Freeze "today" so the week/overdue windows don't drift with the real clock.
// matchesDue takes today as an argument, but buildGroups doesn't thread it
// through, so the fixtures below use dates that are unambiguous either way.
const FAR_PAST = '2020-01-01'
const FAR_FUTURE = '2999-01-01'

// --- unfiltered: empty categories stay, so a new category doesn't look broken
{
  const tasks = [task('work', TODAY)]
  const groups = buildGroups(categories, tasks, { filter: ALL, dueFilter: 'any' })
  assert.deepEqual(names(groups), ['Work', 'Chores'])
  assert.equal(groups[1].tasks.length, 0)
}

// --- unfiltered: Strays never shows up empty
{
  const groups = buildGroups(categories, [task('work')], { filter: ALL, dueFilter: 'any' })
  assert.equal(
    names(groups).includes('Strays'),
    false,
    'Strays must stay hidden while nothing is loose',
  )
}

// --- unfiltered: Strays appears once a task has no category
{
  const groups = buildGroups(categories, [task(null)], { filter: ALL, dueFilter: 'any' })
  assert.deepEqual(names(groups), ['Work', 'Chores', 'Strays'])
}

// --- THE BUG: under a due filter, a category with no matching task disappears
{
  const tasks = [task('work', FAR_PAST), task('chores', FAR_FUTURE)]
  const groups = buildGroups(categories, tasks, { filter: ALL, dueFilter: 'overdue' })
  assert.deepEqual(names(groups), ['Work'], 'Chores has nothing overdue, so it must not render')
  assert.equal(groups[0].tasks.length, 1)
}

// --- a category holding only non-matching tasks is gone, not empty-and-present
{
  const tasks = [task('work', FAR_FUTURE), task('chores', FAR_FUTURE)]
  const groups = buildGroups(categories, tasks, { filter: ALL, dueFilter: 'overdue' })
  assert.deepEqual(names(groups), [])
}

// --- 'no date' filter hides the dated categories
{
  const tasks = [task('work', null), task('chores', FAR_FUTURE)]
  const groups = buildGroups(categories, tasks, { filter: ALL, dueFilter: 'none' })
  assert.deepEqual(names(groups), ['Work'])
}

// --- each surviving group carries only its own matching tasks
{
  const tasks = [task('work', FAR_PAST), task('work', FAR_FUTURE), task('chores', FAR_PAST)]
  const groups = buildGroups(categories, tasks, { filter: ALL, dueFilter: 'overdue' })
  assert.deepEqual(names(groups), ['Work', 'Chores'])
  assert.equal(groups[0].tasks.length, 1)
  assert.equal(groups[0].tasks[0].dueDate, FAR_PAST)
}

// --- clicking a single category shows only it, and shows it even when empty
{
  const tasks = [task('work', FAR_FUTURE), task('chores', FAR_PAST)]
  const groups = buildGroups(categories, tasks, { filter: 'work', dueFilter: 'overdue' })
  assert.deepEqual(names(groups), ['Work'], 'an explicitly opened category still renders')
  assert.equal(groups[0].tasks.length, 0)
}

// --- clicking Strays shows Strays even when empty
{
  const groups = buildGroups(categories, [task('work')], { filter: null, dueFilter: 'any' })
  assert.deepEqual(names(groups), ['Strays'])
  assert.equal(groups[0].tasks.length, 0)
}

// --- no categories at all, no tasks: nothing to render
assert.deepEqual(buildGroups([], [], { filter: ALL, dueFilter: 'any' }), [])

console.log('groups: ok')
