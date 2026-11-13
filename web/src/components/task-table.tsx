import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/api";
import { formatCreatedAt, formatDueDate, isOverdue } from "@/lib/format";

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskTable({ tasks, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="font-medium">No tasks yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="max-w-xs whitespace-normal">
                <div className="font-medium">{task.title}</div>
                {task.description && (
                  <div className="line-clamp-2 text-sm text-muted-foreground">
                    {task.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                {task.dueDate ? (
                  <span
                    className={
                      task.status !== "DONE" && isOverdue(task.dueDate)
                        ? "text-destructive"
                        : undefined
                    }
                  >
                    {formatDueDate(task.dueDate)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatCreatedAt(task.createdAt)}
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(task)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
