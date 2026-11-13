import { StatusBadge } from "@/components/status-badge";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/api";
import { formatCreatedAt, formatDueDate, isOverdue } from "@/lib/format";
import type { SortKey, SortState } from "@/lib/task-view";

// Keeps the heading row visible while the list scrolls
const STICKY_HEAD =
  "sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--border)] first:rounded-tl-lg last:rounded-tr-lg";

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  sort: SortState;
  onSortChange: (key: SortKey) => void;
};

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="rounded-lg border bg-card">
      {/* A plain table: the Table component adds a wrapper that would stop sticky headings */}
      <table className="w-full caption-bottom text-sm">
        <TableHeader>
          <TableRow>
            <SortableHead
              label="Title"
              sortKey="title"
              sort={sort}
              onSort={onSortChange}
            />
            <SortableHead
              label="Status"
              sortKey="status"
              sort={sort}
              onSort={onSortChange}
            />
            <SortableHead
              label="Due date"
              sortKey="dueDate"
              sort={sort}
              onSort={onSortChange}
            />
            <SortableHead
              label="Created"
              sortKey="createdAt"
              sort={sort}
              onSort={onSortChange}
            />
            <TableHead className={`${STICKY_HEAD} text-right`}>
              Actions
            </TableHead>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}

type SortableHeadProps = {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
};

// A column heading you can click to sort by that column
function SortableHead({ label, sortKey, sort, onSort }: SortableHeadProps) {
  const active = sort.key === sortKey;
  const Icon = !active
    ? ArrowUpDown
    : sort.direction === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <TableHead
      className={STICKY_HEAD}
      aria-sort={
        active
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2.5"
        onClick={() => onSort(sortKey)}
      >
        {label}
        <Icon className={active ? undefined : "opacity-40"} />
      </Button>
    </TableHead>
  );
}
