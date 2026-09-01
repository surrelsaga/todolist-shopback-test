// Run: npm test
import assert from 'node:assert/strict'
import { toTrash, fromTrash, trashCategoryTasks } from './trash.js'

const NOW = '2026-09-01T10:00:00.000Z'
const categories = [{ id: 'c1', name: 'Work' }]

const task = {
  id: 't1',
  title: 'Ship the deck',
  description: 'slides 12-18',
  status: 'incomplete',
  categoryId: 'c1',
  dueDate: '2026-09-04',
  createdAt: '2026-08-28T09:00:00.000Z',
}

// Trashing stamps deletedAt and touches nothing else.
const trashed = toTrash(task, NOW)
assert.equal(trashed.deletedAt, NOW)
assert.deepEqual({ ...trashed, deletedAt: undefined }, { ...task, deletedAt: undefined })
assert.equal(task.deletedAt, undefined, 'the original object must not be mutated')

// Restoring drops deletedAt and returns the task exactly as it was.
assert.deepEqual(fromTrash(trashed, categories), task)
assert.equal('deletedAt' in fromTrash(trashed, categories), false)

// Its category was deleted while it sat in the bin: it comes back as a stray,
// not filed under a group that no longer exists.
const orphan = fromTrash(trashed, [])
assert.equal(orphan.categoryId, null)
assert.equal(orphan.title, 'Ship the deck')

// A task that was already a stray stays one.
assert.equal(fromTrash(toTrash({ ...task, categoryId: null }, NOW), categories).categoryId, null)

// Completed tasks come back completed, not silently reset.
assert.equal(fromTrash(toTrash({ ...task, status: 'complete' }, NOW), categories).status, 'complete')

// A task binned on its own, while its category still exists, restores straight
// back into that category — it never detours through Strays.
assert.equal(fromTrash(toTrash(task, NOW), categories).categoryId, 'c1')

// --- deleting a category bins its tasks instead of scattering them ---
{
  const work = { ...task, id: 'w1' }
  const alsoWork = { ...task, id: 'w2', title: 'Book the room' }
  const elsewhere = { ...task, id: 'x1', categoryId: 'c2' }
  const stray = { ...task, id: 's1', categoryId: null }
  const existing = { ...task, id: 'old', deletedAt: '2026-08-01T00:00:00.000Z' }

  const next = trashCategoryTasks([work, alsoWork, elsewhere, stray], [existing], 'c1', NOW)

  // Only that category's tasks leave the active list.
  assert.deepEqual(
    next.tasks.map((t) => t.id),
    ['x1', 's1'],
  )

  // They land in the bin, newest first, ahead of what was already there.
  assert.deepEqual(
    next.trash.map((t) => t.id),
    ['w1', 'w2', 'old'],
  )
  assert.equal(next.trash[0].deletedAt, NOW)

  // The whole point: they remember where they lived.
  assert.equal(next.trash[0].categoryId, 'c1')
  assert.equal(next.trash[1].categoryId, 'c1')

  // The category itself is gone by the time they're restored, so they surface
  // as strays rather than vanishing into a group that no longer renders.
  assert.equal(fromTrash(next.trash[0], []).categoryId, null)

  // But recreate a category with that id and they find their way home.
  assert.equal(fromTrash(next.trash[0], [{ id: 'c1', name: 'Work again' }]).categoryId, 'c1')

  // Deleting an empty category disturbs nothing.
  const untouched = trashCategoryTasks([stray], [], 'c9', NOW)
  assert.deepEqual(untouched.tasks, [stray])
  assert.deepEqual(untouched.trash, [])
}

console.log('trash: ok')
