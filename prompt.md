Build a React todo-list app (Vite + React, no backend). This is step 1 of the build order in planning.txt — only core task operations, nothing else yet (no categories, no localStorage, no due dates, no trash).

Scope for this prompt:
- Set up a Vite + React app.
- A `Task` type/shape: id, title, description, status (complete/incomplete), createdAt. Skip dueDate, category, deletedAt for now — later prompts will add them.
- UI to add a task (title required, description optional).
- UI to edit a task's title/description.
- UI to delete a task (permanent for now — trash comes in a later prompt).
- Toggle a task complete/incomplete.
- List all tasks, visually distinguishing complete vs incomplete.
- Keep state in memory (React state) only — no persistence yet.
- Styling: simple but playful/funny tone (loose, colorful, a bit of personality in copy/microcopy) — doesn't need to be polished, just not corporate-bland.

Keep the component structure minimal: it's fine to start with one `App.jsx` plus maybe a `TaskItem` component. Don't build category grouping, filtering, or persistence scaffolding yet — later prompts add those on top of this.
