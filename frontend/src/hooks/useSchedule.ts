import { useState } from 'react'

export function useSchedule() {
  const [selectedDay, setSelectedDay] = useState(21)
  const [view, setView] = useState<'Week' | 'Month'>('Week')
  return { selectedDay, setSelectedDay, view, setView }
}
