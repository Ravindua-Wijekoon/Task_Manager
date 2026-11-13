import { CalendarDays } from "lucide-react";
import { StatusBadge, statusCardClass } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Task } from "@/lib/api";
import { formatCreatedAt, formatDueDate, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

// Shows each task as a card. The top bar and tint show its status.
export function TaskCards({ tasks, onEdit, onDelete }: Props) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => {
        const overdue =
          task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);

        return (
          <li key={task.id}>
            <Card className={cn("h-full", statusCardClass(task.status))}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="break-words">{task.title}</CardTitle>
                  <StatusBadge status={task.status} />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {task.description && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-sm">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  {task.dueDate ? (
                    <span className={overdue ? "text-destructive" : undefined}>
                      {overdue ? "Overdue: " : "Due "}
                      {formatDueDate(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Created {formatCreatedAt(task.createdAt)}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(task)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
