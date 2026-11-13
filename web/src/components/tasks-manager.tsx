"use client";

import { useEffect, useMemo, useState } from "react";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { DateRangeChips } from "@/components/date-range-chips";
import { EmptyState } from "@/components/empty-state";
import { ScrollableList } from "@/components/scrollable-list";
import { TaskCards } from "@/components/task-cards";
import { TaskFilters } from "@/components/task-filters";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { TaskTable } from "@/components/task-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewToggle } from "@/components/view-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { getTasks, type Task } from "@/lib/api";
import {
  DEFAULT_SORT,
  filterAndSort,
  nextSort,
  type DateRange,
  type SortKey,
  type SortState,
  type StatusFilter,
  type ViewMode,
} from "@/lib/task-view";

// Owns the task list: fetches it and decides what to show (loading, error or table)
export function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state. The task stays set while the dialog closes so it doesn't flicker
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [view, setView] = useState<ViewMode>("cards");
  const visibleTasks = useMemo(
    () => filterAndSort(tasks, statusFilter, dateRange, sort),
    [tasks, statusFilter, dateRange, sort],
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Bump this number to fetch the list again
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    getTasks()
      .then((data) => {
        if (ignore) return;
        setTasks(data);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    // Ignore the result if the component unmounts or a newer fetch starts
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function retry() {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  function openCreate() {
    setEditingTask(null);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  function openDelete(task: Task) {
    setTaskToDelete(task);
    setDeleteOpen(true);
  }

  const filtersActive = statusFilter !== "ALL" || dateRange !== "all";

  function clearFilters() {
    setStatusFilter("ALL");
    setDateRange("all");
  }

  function refresh() {
    setReloadKey((key) => key + 1);
  }

  return (
    <main className="mx-auto flex h-dvh w-full max-w-5xl flex-col gap-6 overflow-hidden p-6">
      <div className="flex shrink-0 items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks Management System</h1>
        <Button onClick={openCreate}>New task</Button>
      </div>

      {loading ? (
        <div className="space-y-2" aria-busy="true" aria-label="Loading tasks">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-border" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center pb-24">
          <div
            role="alert"
            className="w-full max-w-md space-y-3 rounded-lg border border-destructive/40 bg-card p-8 text-center"
          >
            <p className="font-medium text-destructive">Could not load tasks</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          </div>
        </div>
      ) : (
        <>
          {tasks.length > 0 && (
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <TaskFilters
                  status={statusFilter}
                  onStatusChange={setStatusFilter}
                  sort={view === "cards" ? sort : undefined}
                  onSortChange={setSort}
                />
                <DateRangeChips value={dateRange} onChange={setDateRange} />
                {filtersActive && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X /> Clear filters
                  </Button>
                )}
              </div>
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          )}

          {/* Only this part scrolls; the header and filters stay in place */}
          <ScrollableList>
            {visibleTasks.length === 0 ? (
              <EmptyState
                filtered={tasks.length > 0}
                onClearFilters={clearFilters}
              />
            ) : view === "table" ? (
              <TaskTable
                tasks={visibleTasks}
                sort={sort}
                onSortChange={(key: SortKey) =>
                  setSort((s) => nextSort(s, key))
                }
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ) : (
              <TaskCards
                tasks={visibleTasks}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            )}
          </ScrollableList>
        </>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSaved={refresh}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        task={taskToDelete}
        onDeleted={refresh}
      />
    </main>
  );
}
