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
import {
  SORT_OPTIONS,
  sortToValue,
  type SortState,
  type StatusFilter,
} from "@/lib/task-view";

const STATUS_ITEMS = [
  { value: "ALL", label: "All statuses" },
  ...TASK_STATUSES.map((status) => ({
    value: status,
    label: statusLabel(status),
  })),
];

type Props = {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  // Only passed in card view, where there are no column headings to click
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
};

// Dropdowns to filter by status and (in card view) to choose the sort order
export function TaskFilters({
  status,
  onStatusChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        items={STATUS_ITEMS}
        value={status}
        onValueChange={(value) =>
          value && onStatusChange(value as StatusFilter)
        }
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

      {sort && onSortChange && (
        <Select
          items={SORT_OPTIONS}
          value={sortToValue(sort)}
          onValueChange={(value) => {
            const option = SORT_OPTIONS.find((o) => o.value === value);
            if (option) onSortChange(option.sort);
          }}
        >
          <SelectTrigger className="w-48" aria-label="Sort tasks">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
