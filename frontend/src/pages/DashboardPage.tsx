import { useState, type FormEvent, type ReactNode } from 'react'
import { CalendarDays, Check, ChartColumn, LayoutDashboard } from 'lucide-react'
import type { ApiCalendarEvent } from '../api/client'
import type { DashboardSummary } from '../hooks/useDashboardSummary'
import type { useSchedule } from '../hooks/useSchedule'
import type { Task } from '../hooks/useTasks'
import TaskList from '../components/TaskList'
import { useDashboard } from '../hooks/useDashboard'
import '../styles/dashboard.css'

type Props = {
  tasks: Task[]
  filteredTasks: Task[]
  completedCount: number
  summary: DashboardSummary | null
  schedule: ReturnType<typeof useSchedule>
  search: string
  userName: string
  onToggleTask: (id: string) => void
  onAddTask: (title: string) => void | Promise<void>
  onViewTasks: () => void
  onViewSchedule: () => void
}

export default function DashboardPage({ tasks, filteredTasks, completedCount, summary, schedule, search, userName,
  onToggleTask, onAddTask, onViewTasks, onViewSchedule }: Props) {
  const { showAddTask, openAddTask, closeAddTask } = useDashboard()
  const [title, setTitle] = useState('')
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  }).toUpperCase()
  const totalTasks = summary?.totalTasks ?? tasks.length
  const doneTasks = summary?.completedTasks ?? completedCount
  const upcomingTasks = summary?.tasksDueInRange ?? tasks.filter(task => task.due !== 'No date').length

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const taskTitle = title.trim()
    if (!taskTitle) return
    void onAddTask(taskTitle)
    setTitle('')
    closeAddTask()
  }

  return (
    <div className="dashboard-content">
      <div className="welcome-row">
        <div>
          <div className="date-line">{todayLabel}<span>☀</span></div>
          <h1>Good morning, {userName.split(' ')[0] || 'there'}<span className="wave">✦</span></h1>
          <p>Here's what's happening with your work today.</p>
        </div>
        <button className="primary-button" onClick={openAddTask}>＋ Add task</button>
      </div>

      <section className="stat-grid">
        <StatCard title="MY TASKS" value={totalTasks} note="In this workspace" tone="blue" icon={<LayoutDashboard />} />
        <StatCard title="COMPLETED" value={doneTasks} note="Tasks marked complete" tone="green" icon={<Check />} />
        <StatCard title="UPCOMING" value={upcomingTasks} suffix="tasks" note="Due in the next 7 days" tone="purple" icon={<ChartColumn />} />
        <StatCard title="SCHEDULED" value={schedule.events.length} suffix="events" note="On the selected day" tone="amber" icon={<CalendarDays />} />
      </section>

      <div className="content-grid">
        <section className="panel task-panel">
          <div className="panel-heading">
            <div>
              <h2>My tasks</h2>
              <p>You have <strong>{tasks.filter(task => !task.done).length} tasks</strong> to complete</p>
            </div>
            <button className="more-button" aria-label="More task options">···</button>
          </div>
          <div className="task-tabs">
            <button className="selected">All tasks <span>{tasks.length}</span></button>
            <button>Today <span>{tasks.filter(task => task.due === 'Today').length}</span></button>
            <button>Upcoming</button>
            <button className="filter-button">☷ <span>Filter</span></button>
          </div>
          <TaskList tasks={filteredTasks} onToggle={onToggleTask} onViewAll={onViewTasks} search={search} />
        </section>
        <AgendaCard schedule={schedule} onViewSchedule={onViewSchedule} />
      </div>

      <footer className="dashboard-footer">
        <span>Made for focused work <b>✦</b></span>
        <span>Need a hand? <a href="#help">Visit our help center</a></span>
      </footer>

      {showAddTask && (
        <div className="modal-backdrop" onClick={closeAddTask}>
          <form className="add-modal" onSubmit={submit} onClick={event => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeAddTask}>×</button>
            <span className="eyebrow">NEW TASK</span>
            <h2>What needs to get done?</h2>
            <p>Add a task to your list for today.</p>
            <input autoFocus placeholder="e.g. Prepare project update" value={title}
              onChange={event => setTitle(event.target.value)} required />
            <button className="primary-button" type="submit">Create task <span>→</span></button>
          </form>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, suffix, note, tone, icon }: {
  title: string
  value: number
  suffix?: string
  note: string
  tone: 'blue' | 'green' | 'purple' | 'amber'
  icon: ReactNode
}) {
  return (
    <article className="stat-card">
      <div className="stat-title">{title}<span className={`stat-icon ${tone}-soft`}>{icon}</span></div>
      <div className="stat-value">{value}{suffix && <span className="stat-unit"> {suffix}</span>}</div>
      <div className="stat-note">{note}</div>
    </article>
  )
}

function AgendaCard({ schedule, onViewSchedule }: {
  schedule: ReturnType<typeof useSchedule>
  onViewSchedule: () => void
}) {
  return (
    <section className="panel agenda-panel">
      <div className="panel-heading">
        <div>
          <h2>Today's agenda</h2>
          <p>{schedule.selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button className="calendar-switch">{schedule.weekStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}⌄</button>
      </div>
      <div className="week-strip">
        {schedule.days.map(day => {
          const active = day.toDateString() === schedule.selectedDate.toDateString()
          return <button key={day.toISOString()} className={active ? 'day-active' : ''} onClick={() => schedule.setSelectedDate(day)}>
            <span>{day.toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
            <strong>{day.getDate()}</strong>
            {active && <i />}
          </button>
        })}
      </div>
      <div className="agenda-events">
        {schedule.error && <p role="alert">{schedule.error}</p>}
        {!schedule.error && schedule.events.length === 0 && <p className="empty-tasks">No events for this day.</p>}
        {schedule.events.map(event => <DashboardEvent key={event.id} event={event} />)}
      </div>
      <button className="view-all" onClick={onViewSchedule}>View full schedule <span>→</span></button>
    </section>
  )
}

function DashboardEvent({ event }: { event: ApiCalendarEvent }) {
  const start = new Date(event.startAt)
  const end = new Date(event.endAt)
  const tone = event.color && ['blue', 'violet', 'purple', 'orange', 'green'].includes(event.color) ? event.color : 'blue'
  return (
    <div className="agenda-event-row">
      <div className="time-label">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <article className={`event-card event-${tone}`}>
        <i />
        <div>
          <strong>{event.title}</strong>
          <span>{start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} – {end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}{event.location ? ` · ${event.location}` : ''}</span>
        </div>
      </article>
    </div>
  )
}
