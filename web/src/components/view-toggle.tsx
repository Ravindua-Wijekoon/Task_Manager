import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/lib/task-view";

type Props = {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
};

// Two buttons to switch between the table and the card layout
export function ViewToggle({ view, onViewChange }: Props) {
  return (
    <div className="flex gap-1" role="group" aria-label="Choose layout">
      <Button
        variant={view === "table" ? "default" : "outline"}
        size="sm"
        aria-pressed={view === "table"}
        onClick={() => onViewChange("table")}
      >
        <Table2 /> Table
      </Button>
      <Button
        variant={view === "cards" ? "default" : "outline"}
        size="sm"
        aria-pressed={view === "cards"}
        onClick={() => onViewChange("cards")}
      >
        <LayoutGrid /> Cards
      </Button>
    </div>
  );
}
