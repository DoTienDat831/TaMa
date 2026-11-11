import { useMemo, useState } from 'react'
import type { Task } from './useTasks'

export function useTasksPage(tasks: Task[], search: string) {
  const [filter, setFilter] = useState<'All' | 'Today' | 'Upcoming'>('All')
  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || (filter === 'Today' ? task.dueToday : !task.dueToday)
    return matchesSearch && matchesFilter
  }), [tasks, search, filter])
  return { filter, setFilter, visibleTasks }
}
