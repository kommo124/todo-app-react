import type { Todo, TodoInput } from "./types";

const BASE_URL = "/api/todos";
const REQUEST_TIMEOUT_MS = 15000;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...rest } = options;
  const response = await fetch(`${BASE_URL}${path}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    ...rest,
    headers: { "Content-Type": "application/json", ...headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail =
      typeof body?.detail === "string"
        ? body.detail
        : `HTTP ${response.status}`;
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export const api = {
  list: () => request<Todo[]>("/"),

  create: (payload: { title: string; description: string | null }) =>
    request<Todo>("/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: TodoInput) =>
    request<Todo>(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  toggle: (id: number) => request<Todo>(`/${id}/toggle`, { method: "PATCH" }),

  remove: (id: number) => request<void>(`/${id}`, { method: "DELETE" }),
};
