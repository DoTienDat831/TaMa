import { useState } from 'react'

export function useDashboard() {
  const [showAddTask, setShowAddTask] = useState(false)
  const openAddTask = () => setShowAddTask(true)
  const closeAddTask = () => setShowAddTask(false)
  return { showAddTask, openAddTask, closeAddTask }
}
