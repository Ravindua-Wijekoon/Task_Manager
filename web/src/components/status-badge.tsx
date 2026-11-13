import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/lib/api";

const STATUS_STYLES: Record<
  TaskStatus,
  { label: string; className: string; cardClassName: string }
> = {
  TODO: {
    label: "To do",
    className: "bg-secondary text-secondary-foreground",
    cardClassName: "border-t-4 border-t-slate-400",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    cardClassName:
      "border-t-4 border-t-blue-500 bg-blue-50 dark:bg-blue-950/30",
  },
  DONE: {
    label: "Done",
    className:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    cardClassName:
      "border-t-4 border-t-green-500 bg-green-50 dark:bg-green-950/30",
  },
};

export function statusLabel(status: TaskStatus) {
  return STATUS_STYLES[status].label;
}

// Colour classes for a task card, matching its status
export function statusCardClass(status: TaskStatus) {
  return STATUS_STYLES[status].cardClassName;
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = STATUS_STYLES[status];
  return <Badge className={className}>{label}</Badge>;
}
