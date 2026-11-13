import { TASK_STATUSES, type Task, type TaskStatus } from "@/lib/api";

export type StatusFilter = TaskStatus | "ALL";
export type SortKey = "title" | "status" | "dueDate" | "createdAt";
export type SortDirection = "asc" | "desc";
export type SortState = { key: SortKey; direction: SortDirection };
export type ViewMode = "table" | "cards";
export type DateRange = "all" | "week" | "month";

export const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: "all", label: "All" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

// Local date as "YYYY-MM-DD", the same format as the start of a due date string
function toDateString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// First and last day of the range around `now`. The week runs Monday to Sunday.
function rangeBounds(range: Exclude<DateRange, "all">, now: Date) {
  let start: Date;
  let end: Date;

  if (range === "week") {
    const daysSinceMonday = (now.getDay() + 6) % 7;
    start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysSinceMonday,
    );
    end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }
  return { start: toDateString(start), end: toDateString(end) };
}

// Choices for the sort dropdown (used in card view, which has no column headings)
export const SORT_OPTIONS: { value: string; label: string; sort: SortState }[] =
  [
    {
      value: "createdAt:desc",
      label: "Newest first",
      sort: { key: "createdAt", direction: "desc" },
    },
    {
      value: "createdAt:asc",
      label: "Oldest first",
      sort: { key: "createdAt", direction: "asc" },
    },
    {
      value: "title:asc",
      label: "Title: A to Z",
      sort: { key: "title", direction: "asc" },
    },
    {
      value: "title:desc",
      label: "Title: Z to A",
      sort: { key: "title", direction: "desc" },
    },
    {
      value: "dueDate:asc",
      label: "Due date: soonest",
      sort: { key: "dueDate", direction: "asc" },
    },
    {
      value: "dueDate:desc",
      label: "Due date: latest",
      sort: { key: "dueDate", direction: "desc" },
    },
    {
      value: "status:asc",
      label: "Status: To do first",
      sort: { key: "status", direction: "asc" },
    },
    {
      value: "status:desc",
      label: "Status: Done first",
      sort: { key: "status", direction: "desc" },
    },
  ];

export const sortToValue = (sort: SortState) => `${sort.key}:${sort.direction}`;

// The list starts with the newest tasks first
export const DEFAULT_SORT: SortState = { key: "createdAt", direction: "desc" };

// Compares two tasks by one column (ascending)
function compareBy(key: SortKey, a: Task, b: Task): number {
  switch (key) {
    case "title":
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    case "status":
      // Follow the workflow order (To do, In progress, Done), not the alphabet
      return TASK_STATUSES.indexOf(a.status) - TASK_STATUSES.indexOf(b.status);
    case "createdAt":
      return a.createdAt.localeCompare(b.createdAt);
    case "dueDate":
      return (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
  }
}

// Applies the chosen filter and sort without changing the original list
export function filterAndSort(
  tasks: Task[],
  status: StatusFilter,
  range: DateRange,
  sort: SortState,
  now?: Date,
): Task[] {
  const byStatus =
    status === "ALL" ? tasks : tasks.filter((task) => task.status === status);

  // Date chips look at the due date, so tasks without one only show under "All"
  let filtered = byStatus;
  if (range !== "all") {
    // Only read the clock when a date chip is chosen
    const { start, end } = rangeBounds(range, now ?? new Date());
    filtered = byStatus.filter((task) => {
      if (!task.dueDate) return false;
      const due = task.dueDate.slice(0, 10);
      return due >= start && due <= end;
    });
  }

  const direction = sort.direction === "asc" ? 1 : -1;
  return [...filtered].sort((a, b) => {
    // Tasks without a due date always go last, whichever way we sort
    if (sort.key === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
    }
    return compareBy(sort.key, a, b) * direction;
  });
}

// Clicking a column sorts by it; clicking the same column again flips the direction
export function nextSort(current: SortState, key: SortKey): SortState {
  if (current.key === key) {
    return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  }
  return { key, direction: "asc" };
}
