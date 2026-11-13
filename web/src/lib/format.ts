// Due dates are saved as midnight UTC, so read them in UTC to avoid showing the wrong day
export function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatCreatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// True when the due date (a UTC day) is before today
export function isOverdue(iso: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10) < today;
}
