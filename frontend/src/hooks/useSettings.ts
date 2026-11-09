import { useEffect, useState } from 'react'
import { apiGet, apiPut, type ApiUserPreference } from '../api/client'

export function useSettings(userId: string | null) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [compactTasks, setCompactTasks] = useState(false)
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh')

  useEffect(() => {
    if (!userId) return
    let active = true
    void apiGet<ApiUserPreference>(`/users/${userId}/preferences`).then(preference => {
      if (!active) return
      setNotificationsEnabled(preference.notificationsEnabled)
      setCompactTasks(preference.compactTasks)
      setTimezone(preference.timezone)
    }).catch(() => undefined)
    return () => { active = false }
  }, [userId])

  const save = async (next: Partial<ApiUserPreference>) => {
    if (!userId) return
    const body = {
      notificationsEnabled: next.notificationsEnabled ?? notificationsEnabled,
      compactTasks: next.compactTasks ?? compactTasks,
      timezone: next.timezone ?? timezone,
    }
    try {
      const saved = await apiPut<ApiUserPreference>(`/users/${userId}/preferences`, body)
      setNotificationsEnabled(saved.notificationsEnabled)
      setCompactTasks(saved.compactTasks)
      setTimezone(saved.timezone)
    } catch { /* Keep the displayed preference if the API is temporarily unavailable. */ }
  }

  const updateNotifications = (value: boolean) => {
    setNotificationsEnabled(value)
    void save({ notificationsEnabled: value })
  }
  const updateCompactTasks = (value: boolean) => {
    setCompactTasks(value)
    void save({ compactTasks: value })
  }

  return {
    notificationsEnabled,
    setNotificationsEnabled: updateNotifications,
    compactTasks,
    setCompactTasks: updateCompactTasks,
  }
}
