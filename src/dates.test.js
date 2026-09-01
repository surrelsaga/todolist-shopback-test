// Run: npm test
import assert from 'node:assert/strict'
import { addDays, matchesDue, isOverdue } from './dates.js'

const TODAY = '2026-09-01'
const task = (dueDate, status = 'incomplete') => ({ dueDate, status })

assert.equal(addDays(TODAY, 7), '2026-09-08')
assert.equal(addDays('2026-02-28', 1), '2026-03-01')
assert.equal(addDays('2026-12-31', 1), '2027-01-01')

// 'any' keeps everything, dated or not.
assert.equal(matchesDue(task(undefined), 'any', TODAY), true)
assert.equal(matchesDue(task('1999-01-01'), 'any', TODAY), true)

// Overdue is strictly in the past, and only while still incomplete.
assert.equal(matchesDue(task('2026-08-31'), 'overdue', TODAY), true)
assert.equal(matchesDue(task(TODAY), 'overdue', TODAY), false)
assert.equal(matchesDue(task('2026-08-31', 'complete'), 'overdue', TODAY), false)
assert.equal(matchesDue(task(undefined), 'overdue', TODAY), false)

assert.equal(matchesDue(task(TODAY), 'today', TODAY), true)
assert.equal(matchesDue(task('2026-09-02'), 'today', TODAY), false)

// The week window includes both ends and excludes the past.
assert.equal(matchesDue(task(TODAY), 'week', TODAY), true)
assert.equal(matchesDue(task('2026-09-08'), 'week', TODAY), true)
assert.equal(matchesDue(task('2026-09-09'), 'week', TODAY), false)
assert.equal(matchesDue(task('2026-08-31'), 'week', TODAY), false)

// Undated tasks are findable instead of lost.
assert.equal(matchesDue(task(undefined), 'none', TODAY), true)
assert.equal(matchesDue(task(''), 'none', TODAY), true)
assert.equal(matchesDue(task(TODAY), 'none', TODAY), false)

assert.equal(isOverdue(task('2026-08-31'), TODAY), true)
assert.equal(isOverdue(task('2026-08-31', 'complete'), TODAY), false)

console.log('dates: ok')
