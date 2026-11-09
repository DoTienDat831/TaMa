import { useMemo } from 'react'
import type { Task } from './useTasks'

export function useProjectPage(name: string, tasks: Task[]) {
  return useMemo(() => tasks.filter(task => task.project === name), [name, tasks])
}
