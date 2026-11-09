import { useEffect, useState } from 'react'
import { apiGet } from '../api/client'

export type DashboardSummary = {
  totalTasks: number
  completedTasks: number
  openTasks: number
  tasksDueInRange: number
}

export function useDashboardSummary(workspaceId: string | null, refreshKey: string) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    if (!workspaceId) {
      setSummary(null)
      return
    }
    const from = new Date()
    from.setHours(0, 0, 0, 0)
    const to = new Date(from)
    to.setDate(to.getDate() + 7)
    const query = new URLSearchParams({ workspaceId, from: from.toISOString(), to: to.toISOString() })
    let active = true
    void apiGet<DashboardSummary>(`/dashboard?${query}`).then(data => {
      if (active) setSummary(data)
    }).catch(() => {
      if (active) setSummary(null)
    })
    return () => { active = false }
  }, [workspaceId, refreshKey])

  return summary
}
