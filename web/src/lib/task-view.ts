import type { Task, TaskStatus } from "@/lib/api";

export type StatusFilter = TaskStatus | "ALL";
export type SortOrder = "newest" | "due-asc" | "due-desc";

// Applies the chosen filter and sort without changing the original list
export function filterAndSort(
  tasks: Task[],
  status: StatusFilter,
  sort: SortOrder,
): Task[] {
  const filtered =
    status === "ALL" ? tasks : tasks.filter((task) => task.status === status);

  // The API already returns newest first
  if (sort === "newest") return filtered;

  const direction = sort === "due-asc" ? 1 : -1;
  return [...filtered].sort((a, b) => {
    // Tasks without a due date always go last
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate) * direction;
  });
}
