import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiDelete, apiGet, apiPatch, apiPost, apiPut, type ApiProject, type ApiTask } from '../api/client'

export type Task = { id: string; title: string; project: string; due: string; dueAt: string | null; dueToday: boolean; color: string; done: boolean }

function toTask(task: ApiTask): Task {
  const dueDate = task.dueAt ? new Date(task.dueAt) : null
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  const sameDate = (left: Date, right: Date) => left.toDateString() === right.toDateString()
  const due = dueDate
    ? new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(dueDate)
    : 'No deadline'

  return {
    id: task.id,
    title: task.title,
    project: task.projectName ?? 'Personal',
    due,
    dueAt: task.dueAt,
    dueToday: dueDate ? sameDate(dueDate, today) : false,
    color: task.color || 'blue',
    done: task.status === 'DONE',
  }
}

export function useTasks(userId: string | null, workspaceId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    if (!workspaceId) {
      setTasks([])
      setProjects([])
      return
    }
    setLoading(true)
    setError('')
    try {
      const [taskRows, projectRows] = await Promise.all([
        apiGet<ApiTask[]>(`/tasks?workspaceId=${workspaceId}`),
        apiGet<ApiProject[]>(`/projects?workspaceId=${workspaceId}`),
      ])
      setTasks(taskRows.map(toTask))
      setProjects(projectRows)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load workspace data')
    } finally {
      setLoading(false)
    }
  }, [workspaceId])

  useEffect(() => { void loadData() }, [loadData, userId])

  const filteredTasks = useMemo(() => tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase())), [tasks, search])
  const completedCount = tasks.filter(task => task.done).length

  const addTask = async (title: string, deadline: string) => {
    if (!title.trim() || !deadline || !userId || !workspaceId) return
    try {
      const saved = await apiPost<ApiTask>('/tasks', {
        title: title.trim(),
        workspaceId,
        createdByUserId: userId,
        dueAt: new Date(deadline).toISOString(),
        priority: 'MEDIUM',
        color: 'blue',
      })
      setTasks(current => [toTask(saved), ...current])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create task')
    }
  }

  const addProject = async (name: string) => {
    if (!name.trim() || !userId || !workspaceId) return
    try {
      const project = await apiPost<ApiProject>('/projects', {
        name: name.trim(),
        workspaceId,
        createdByUserId: userId,
        color: 'blue',
      })
      setProjects(current => [...current, project].sort((left, right) => left.name.localeCompare(right.name)))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create project')
    }
  }

  const toggleTask = async (id: string) => {
    const current = tasks.find(task => task.id === id)
    if (!current) return
    const status = current.done ? 'TODO' : 'DONE'
    try {
      await apiPatch<ApiTask>(`/tasks/${id}/status?status=${status}`)
      setTasks(rows => rows.map(task => task.id === id ? { ...task, done: status === 'DONE' } : task))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update task')
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await apiDelete(`/tasks/${id}`)
      setTasks(rows => rows.filter(task => task.id !== id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to delete task')
    }
  }

  const updateTask = async (id: string, title: string, deadline: string) => {
    if (!title.trim() || !deadline) return false
    try {
      const saved = await apiPut<ApiTask>(`/tasks/${id}`, {
        title: title.trim(),
        dueAt: new Date(deadline).toISOString(),
      })
      setTasks(rows => rows.map(task => task.id === id ? toTask(saved) : task))
      return true
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update task')
      return false
    }
  }

  return { tasks, projects, filteredTasks, search, setSearch, completedCount, addTask, addProject, toggleTask, deleteTask, updateTask, loading, error, reload: loadData }
}
