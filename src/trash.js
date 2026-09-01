// Deleting is a move, not a destruction: the task keeps every field and gains
// deletedAt. Only "empty the bin" actually loses data.
export const toTrash = (task, now = new Date().toISOString()) => ({ ...task, deletedAt: now })

// Deleting a category bins its tasks instead of scattering them into Strays.
// They keep their categoryId on the way in, so nothing about where they lived
// is lost while they sit in the bin.
export function trashCategoryTasks(tasks, trash, categoryId, now = new Date().toISOString()) {
  return {
    tasks: tasks.filter((t) => t.categoryId !== categoryId),
    trash: [
      ...tasks.filter((t) => t.categoryId === categoryId).map((t) => toTrash(t, now)),
      ...trash,
    ],
  }
}

// A category can be deleted while one of its tasks sits in the bin. Restoring
// such a task with a dangling categoryId would file it under a group that no
// longer renders, so it would come back invisible — send it to Strays instead.
export function fromTrash(task, categories) {
  const { deletedAt, ...restored } = task
  const stillExists = categories.some((c) => c.id === task.categoryId)
  return { ...restored, categoryId: stillExists ? task.categoryId : null }
}
