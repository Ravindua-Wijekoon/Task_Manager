import { DATE_RANGES, type DateRange } from "@/lib/task-view";

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

// Quick buttons to show tasks due this week or this month
export function DateRangeChips({ value, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Due date range"
    >
      {DATE_RANGES.map((range) => {
        const active = value === range.value;
        return (
          <button
            key={range.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(range.value)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
