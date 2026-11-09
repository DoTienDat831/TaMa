const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(payload?.message ?? `Request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const apiGet = <T>(path: string) => apiRequest<T>(path)

export const apiPost = <T>(path: string, body: unknown) => apiRequest<T>(path, {
  method: 'POST',
  body: JSON.stringify(body),
})

export const apiPut = <T>(path: string, body: unknown) => apiRequest<T>(path, {
  method: 'PUT',
  body: JSON.stringify(body),
})

export const apiPatch = <T>(path: string, body?: unknown) => apiRequest<T>(path, {
  method: 'PATCH',
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
})

export const apiDelete = (path: string) => apiRequest<void>(path, { method: 'DELETE' })

export type ApiUser = {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  createdAt: string
}

export type ApiWorkspace = { id: string; name: string; createdAt: string }

export type ApiProject = {
  id: string
  workspaceId: string
  name: string
  description: string | null
  color: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
}

export type ApiTask = {
  id: string
  workspaceId: string
  projectId: string | null
  projectName: string | null
  title: string
  description: string | null
  dueAt: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  color: string | null
  createdByUserId: string
  assigneeId: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ApiCalendarEvent = {
  id: string
  workspaceId: string
  title: string
  description: string | null
  startAt: string
  endAt: string
  location: string | null
  color: string | null
}

export type ApiUserPreference = {
  userId: string
  notificationsEnabled: boolean
  compactTasks: boolean
  timezone: string
}
