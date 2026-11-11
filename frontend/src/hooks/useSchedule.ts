import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet, type ApiCalendarEvent, type ApiTask } from '../api/client'

function sundayOfWeek(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay())
  return start
}

export function useSchedule(workspaceId: string | null) {
  const [weekStart, setWeekStart] = useState(() => sundayOfWeek(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [view, setView] = useState<'Week' | 'Month'>('Week')
  const [events, setEvents] = useState<ApiCalendarEvent[]>([])
  const [workspaceTasks, setWorkspaceTasks] = useState<ApiTask[]>([])
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    if (!workspaceId) {
      setEvents([])
      setWorkspaceTasks([])
      return
    }
    const from = weekStart.toISOString()
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 7)
    const to = end.toISOString()
    const query = new URLSearchParams({ workspaceId, from, to })
    try {
      const [eventRows, taskRows] = await Promise.all([
      apiGet<ApiCalendarEvent[]>(`/events?${query}`),
      apiGet<ApiTask[]>(`/tasks?workspaceId=${workspaceId}`),
      ])
      setEvents(eventRows)
      setWorkspaceTasks(taskRows)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load schedule')
    }
  }, [workspaceId, weekStart])

  useEffect(() => { void reload() }, [reload])

  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + index)
    return date
  }), [weekStart])

  const changeWeek = (amount: number) => {
    setWeekStart(current => {
      const next = new Date(current)
      next.setDate(next.getDate() + 7 * amount)
      return next
    })
    setSelectedDate(current => {
      const next = new Date(current)
      next.setDate(next.getDate() + 7 * amount)
      return next
    })
  }

  const selectedEvents = events.filter(event => new Date(event.startAt).toDateString() === selectedDate.toDateString())
  const selectedTasks = workspaceTasks.filter(task => task.dueAt && new Date(task.dueAt).toDateString() === selectedDate.toDateString())
  return { days, selectedDate, setSelectedDate, weekStart, changeWeek, view, setView, events: selectedEvents, tasks: selectedTasks, error, reload }
}
