"use client";

import { statusLabel } from "@/components/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUSES } from "@/lib/api";
import type { SortOrder, StatusFilter } from "@/lib/task-view";

const STATUS_ITEMS = [
  { value: "ALL", label: "All statuses" },
  ...TASK_STATUSES.map((status) => ({
    value: status,
    label: statusLabel(status),
  })),
];

const SORT_ITEMS = [
  { value: "newest", label: "Newest first" },
  { value: "due-asc", label: "Due date: soonest" },
  { value: "due-desc", label: "Due date: latest" },
];

type Props = {
  status: StatusFilter;
  sort: SortOrder;
  onStatusChange: (status: StatusFilter) => void;
  onSortChange: (sort: SortOrder) => void;
};

// Dropdowns to filter the list by status and sort it by due date
export function TaskFilters({
  status,
  sort,
  onStatusChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        items={STATUS_ITEMS}
        value={status}
        onValueChange={(value) => value && onStatusChange(value as StatusFilter)}
      >
        <SelectTrigger className="w-44" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={SORT_ITEMS}
        value={sort}
        onValueChange={(value) => value && onSortChange(value as SortOrder)}
      >
        <SelectTrigger className="w-48" aria-label="Sort tasks">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
