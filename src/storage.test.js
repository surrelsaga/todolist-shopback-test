// Run: npm test
import assert from 'node:assert/strict'
import { parseState } from './storage.js'

const EMPTY = { tasks: [], categories: [], trash: [] }

// Nothing stored yet.
assert.deepEqual(parseState(null), EMPTY)

// Garbage / hand-edited / truncated write.
assert.deepEqual(parseState('{not json'), EMPTY)
assert.deepEqual(parseState('"a string"'), EMPTY)
assert.deepEqual(parseState('{"tasks":"nope"}'), EMPTY)

// A real round trip keeps every field, including the optional ones.
const state = {
  tasks: [
    {
      id: 'a',
      title: 'Feed the strays',
      description: '',
      status: 'complete',
      categoryId: null,
      createdAt: '2026-09-01T00:00:00.000Z',
    },
  ],
  categories: [{ id: 'c1', name: 'Chores' }],
  trash: [
    {
      id: 'b',
      title: 'Regret',
      description: '',
      status: 'incomplete',
      categoryId: 'c1',
      createdAt: '2026-08-30T00:00:00.000Z',
      deletedAt: '2026-09-01T00:00:00.000Z',
    },
  ],
}
assert.deepEqual(parseState(JSON.stringify(state)), state)

// A blob written before the trash bin existed still loads, with an empty bin.
assert.deepEqual(parseState('{"tasks":[],"categories":[]}'), EMPTY)

console.log('storage: ok')
