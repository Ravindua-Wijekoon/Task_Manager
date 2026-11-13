"use client";

import { useEffect, useState } from "react";
import { TaskTable } from "@/components/task-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTasks, type Task } from "@/lib/api";

// Owns the task list: fetches it and decides what to show (loading, error or table)
export function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>

      {loading ? (
        <div className="space-y-2" aria-busy="true" aria-label="Loading tasks">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="space-y-3 rounded-lg border border-destructive/40 p-6 text-center"
        >
          <p className="font-medium text-destructive">Could not load tasks</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </main>
  );
}
