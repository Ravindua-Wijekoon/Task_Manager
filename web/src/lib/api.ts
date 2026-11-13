const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
};

// What the form sends when creating or editing a task
export type TaskInput = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
};

// Error with a readable message that we can show in the UI
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the API running?");
  }

  if (!res.ok) {
    // Nest sends `message` as a string, or a list when validation fails
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? "Something went wrong");
    throw new ApiError(message, res.status);
  }

  // DELETE returns 204 with no body
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const getTasks = () => request<Task[]>("/tasks");

export const createTask = (data: TaskInput) =>
  request<Task>("/tasks", { method: "POST", body: JSON.stringify(data) });

export const updateTask = (id: number, data: TaskInput) =>
  request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTask = (id: number) =>
  request<void>(`/tasks/${id}`, { method: "DELETE" });
