"use client";

import { useState } from "react";
import { toast } from "sonner";
import { statusLabel } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createTask,
  TASK_STATUSES,
  updateTask,
  type Task,
  type TaskStatus,
} from "@/lib/api";

const STATUS_ITEMS = TASK_STATUSES.map((status) => ({
  value: status,
  label: statusLabel(status),
}));

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // The task being edited, or null when creating a new one
  task: Task | null;
  onSaved: () => void;
};

export function TaskFormDialog({ open, onOpenChange, task, onSaved }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Change the details below and save."
              : "Fill in the details for your new task."}
          </DialogDescription>
        </DialogHeader>
        {/* The form lives inside the dialog, so it starts fresh every time it opens */}
        <TaskForm
          task={task}
          onCancel={() => onOpenChange(false)}
          onSaved={() => {
            onOpenChange(false);
            onSaved();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type FormProps = {
  task: Task | null;
  onCancel: () => void;
  onSaved: () => void;
};

function TaskForm({ task, onCancel, onSaved }: FormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO");
  // A date input works with "YYYY-MM-DD", so cut off the time part
  const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 10) ?? "");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required");
      return;
    }

    setSaving(true);
    const data = {
      title: trimmedTitle,
      description: description.trim() || null,
      status,
      dueDate: dueDate || null,
    };

    try {
      if (task) {
        await updateTask(task.id, data);
        toast.success("Task updated");
      } else {
        await createTask(data);
        toast.success("Task created");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save task");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={title}
          maxLength={200}
          aria-invalid={titleError ? true : undefined}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(null);
          }}
          autoFocus
        />
        {titleError && (
          <p className="text-sm text-destructive" role="alert">
            {titleError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          value={description}
          maxLength={2000}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task-status">Status</Label>
          <Select
            items={STATUS_ITEMS}
            value={status}
            onValueChange={(value) => value && setStatus(value)}
          >
            <SelectTrigger id="task-status" className="w-full">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-due-date">Due date</Label>
          <Input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : task ? "Save changes" : "Create task"}
        </Button>
      </DialogFooter>
    </form>
  );
}
