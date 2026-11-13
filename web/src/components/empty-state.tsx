// Shown when there is nothing to list: no tasks at all, or none match the filter
export function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <p className="font-medium">
        {filtered ? "No tasks match this filter" : "No tasks yet"}
      </p>
      <p className="text-sm text-muted-foreground">
        {filtered
          ? "Try a different status."
          : "Create your first task to get started."}
      </p>
    </div>
  );
}
