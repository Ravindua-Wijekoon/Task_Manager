import { Button } from "@/components/ui/button";

type Props = {
  // True when filters are hiding the tasks
  filtered: boolean;
  onClearFilters: () => void;
};

// Shown when there is nothing to list: no tasks at all, or none match the filters
export function EmptyState({ filtered, onClearFilters }: Props) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <p className="font-medium">
        {filtered ? "No tasks match these filters" : "No tasks yet"}
      </p>
      <p className="mb-4 text-sm text-muted-foreground">
        {filtered
          ? "Try a different status or date range."
          : "Create your first task to get started."}
      </p>
      {filtered && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
