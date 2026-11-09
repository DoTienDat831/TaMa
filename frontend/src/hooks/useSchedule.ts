import { useEffect, useMemo, useState } from 'react'
import { apiGet, type ApiCalendarEvent } from '../api/client'

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
  const [error, setError] = useState('')

  useEffect(() => {
    if (!workspaceId) {
      setEvents([])
      return
    }
    const from = weekStart.toISOString()
    const end = new Date(weekStart)
    end.setDate(end.getDate() + 7)
    const to = end.toISOString()
    let active = true
    const query = new URLSearchParams({ workspaceId, from, to })
    void apiGet<ApiCalendarEvent[]>(`/events?${query}`).then(rows => {
      if (active) {
        setEvents(rows)
        setError('')
      }
    }).catch(cause => {
      if (active) setError(cause instanceof Error ? cause.message : 'Unable to load calendar events')
    })
    return () => { active = false }
  }, [workspaceId, weekStart])

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
  return { days, selectedDate, setSelectedDate, weekStart, changeWeek, view, setView, events: selectedEvents, error }
}
