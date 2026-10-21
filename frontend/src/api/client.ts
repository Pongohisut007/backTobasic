import type { ServerInfo, Todo } from '../types'

// Backend base URL, e.g. http://localhost:3000/api
// Vite inlines this at build time, so it must be set before `npm run build`
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    throw new Error(message ?? `Request failed with status ${res.status}`)
  }

  return res.status === 204 ? (undefined as T) : res.json()
}

export const api = {
  getInfo: () => request<ServerInfo>('/info'),
  getTodos: () => request<Todo[]>('/todos'),
  createTodo: (title: string) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify({ title }) }),
  updateTodo: (id: number, data: Partial<Pick<Todo, 'title' | 'completed'>>) =>
    request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTodo: (id: number) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
}
