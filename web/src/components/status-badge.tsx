import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/lib/api";

const STATUS_STYLES: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: "To do",
    className: "bg-secondary text-secondary-foreground",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  DONE: {
    label: "Done",
    className:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  },
};

export function statusLabel(status: TaskStatus) {
  return STATUS_STYLES[status].label;
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = STATUS_STYLES[status];
  return <Badge className={className}>{label}</Badge>;
}
