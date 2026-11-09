import { useMemo, useState } from 'react'

export type Task = { id: number; title: string; project: string; due: string; color: string; done: boolean }
const initialTasks: Task[] = [
  { id: 1, title: 'Finalize homepage wireframes', project: 'Website redesign', due: 'Today', color: 'blue', done: false },
  { id: 2, title: 'Review Q3 campaign brief', project: 'Marketing', due: 'Today', color: 'orange', done: false },
  { id: 3, title: 'Send notes to the team', project: 'Team sync', due: 'Tomorrow', color: 'purple', done: true },
  { id: 4, title: 'Update product roadmap', project: 'Product', due: 'Tomorrow', color: 'green', done: false },
]

export function useTasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [search, setSearch] = useState('')
  const filteredTasks = useMemo(() => tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase())), [tasks, search])
  const completedCount = tasks.filter(task => task.done).length
  const addTask = (title: string) => {
    if (!title.trim()) return
    setTasks(current => [{ id: Date.now(), title: title.trim(), project: 'Personal', due: 'Today', color: 'blue', done: false }, ...current])
  }
  const toggleTask = (id: number) => setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task))
  return { tasks, filteredTasks, search, setSearch, completedCount, addTask, toggleTask }
}
