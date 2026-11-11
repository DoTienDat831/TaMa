import type { useSchedule } from '../hooks/useSchedule'
import '../styles/schedule.css'

export default function SchedulePage({ schedule }: { schedule: ReturnType<typeof useSchedule> }) {
  const { days, selectedDate, setSelectedDate, weekStart, changeWeek, view, setView, events, tasks, error } = schedule
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(weekStart)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  return (
    <section className="page-content schedule-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">PLAN YOUR WEEK</span>
          <h1>Schedule</h1>
          <p>A clear view of what's coming up.</p>
        </div>
        <div className="schedule-controls">
          <button className={view === 'Week' ? 'chosen' : ''} onClick={() => setView('Week')}>Week</button>
          <button className={view === 'Month' ? 'chosen' : ''} onClick={() => setView('Month')}>Month</button>
        </div>
      </div>

      <section className="panel full-agenda">
        <div className="panel-heading">
          <div>
            <h2>{monthLabel}</h2>
            <p>Week of {weekStart.toLocaleDateString()} – {weekEnd.toLocaleDateString()}</p>
          </div>
          <div className="calendar-arrows">
            <button aria-label="Previous week" onClick={() => changeWeek(-1)}>‹</button>
            <button aria-label="Next week" onClick={() => changeWeek(1)}>›</button>
          </div>
        </div>

        <div className="schedule-week">
          {days.map(day => (
            <button key={day.toISOString()} className={day.toDateString() === selectedDate.toDateString() ? 'day-active' : ''}
              onClick={() => setSelectedDate(day)}>
              <span>{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
              <strong>{day.getDate()}</strong>
            </button>
          ))}
        </div>

        <div className="full-events">
          {error && <p role="alert">{error}</p>}
          {!error && events.length === 0 && tasks.length === 0 && <p className="empty-tasks">Nothing scheduled for this day.</p>}
          {events.map(event => (
            <AgendaEvent key={event.id} event={event} />
          ))}
          {tasks.length > 0 && <h3 className="schedule-section-title">Tasks due</h3>}
          {tasks.map(task => (
            <article className="event-card event-blue schedule-task-card" key={task.id}>
              <i />
              <div>
                <strong>{task.title}</strong>
                <span>{new Date(task.dueAt!).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · {task.projectName ?? 'Personal'} · {task.status === 'DONE' ? 'Completed' : 'To do'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

function AgendaEvent({ event }: { event: { title: string; description: string | null; startAt: string; endAt: string; location: string | null; color: string | null } }) {
  const start = new Date(event.startAt)
  const end = new Date(event.endAt)
  const time = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const details = `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}${event.location ? ` · ${event.location}` : ''}`
  const tone = event.color && ['blue', 'violet', 'purple', 'orange', 'green'].includes(event.color) ? event.color : 'blue'
  return (
    <div className="schedule-event-row">
      <span>{time}</span>
      <article className={`event-card event-${tone}`}>
        <i />
        <div>
          <strong>{event.title}</strong>
          <span>{details}{event.description ? ` · ${event.description}` : ''}</span>
        </div>
      </article>
    </div>
  )
}
