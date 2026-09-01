const KEY = 'todolist.v1'

const EMPTY = { tasks: [], categories: [], trash: [] }

// Anything could be sitting in localStorage: absent, half-written, edited by hand,
// or written by an older version. Never let it crash the app — fall back to empty.
export function parseState(raw) {
  try {
    const { tasks, categories, trash } = JSON.parse(raw) ?? {}
    return {
      tasks: Array.isArray(tasks) ? tasks : [],
      categories: Array.isArray(categories) ? categories : [],
      trash: Array.isArray(trash) ? trash : [],
    }
  } catch {
    return { ...EMPTY }
  }
}

export function loadState() {
  try {
    return parseState(localStorage.getItem(KEY))
  } catch {
    return { ...EMPTY } // localStorage itself can throw (private mode, blocked cookies)
  }
}

// ponytail: rewrites the whole blob on every change. Fine for a personal list;
// switch to per-key writes if it ever gets big enough to stutter.
export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* quota or blocked storage — the app keeps working in memory */
  }
}
