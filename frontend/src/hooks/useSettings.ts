import { useState } from 'react'

export function useSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [compactTasks, setCompactTasks] = useState(false)
  return { notificationsEnabled, setNotificationsEnabled, compactTasks, setCompactTasks }
}
