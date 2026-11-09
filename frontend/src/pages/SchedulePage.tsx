
import { useSchedule } from '../hooks/useSchedule'
import '../styles/schedule.css'

const days = [
  ['S', '20'],
  ['M', '21'],
  ['T', '22'],
  ['W', '23'],
  ['T', '24'],
  ['F', '25'],
  ['S', '26'],
]

export default function SchedulePage() {
  const { selectedDay, setSelectedDay, view, setView } = useSchedule()

  return (
    <section className="page-content schedule-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">PLAN YOUR WEEK</span>
          <h1>Schedule</h1>
          <p>A clear view of what's coming up.</p>
        </div>

        <div className="schedule-controls">
          <button
            className={view === 'Week' ? 'chosen' : ''}
            onClick={() => setView('Week')}
          >
            Week
          </button>
          <button
            className={view === 'Month' ? 'chosen' : ''}
            onClick={() => setView('Month')}
          >
            Month
          </button>
        </div>
      </div>

      <section className="panel full-agenda">
        <div className="panel-heading">
          <div>
            <h2>October 2024</h2>
            <p>Week of October 20 – 26</p>
          </div>

          <div className="calendar-arrows">
            <button aria-label="Previous week">‹</button>
            <button aria-label="Next week">›</button>
          </div>
        </div>

        <div className="schedule-week">
          {days.map(([day, number]) => (
            <button
              key={number}
              className={Number(number) === selectedDay ? 'day-active' : ''}
              onClick={() => setSelectedDay(Number(number))}
            >
              <span>
                {day === 'S' && number === '20'
                  ? 'Sun'
                  : day === 'M'
                    ? 'Mon'
                    : day === 'T' && number === '22'
                      ? 'Tue'
                      : day === 'W'
                        ? 'Wed'
                        : day === 'T'
                          ? 'Thu'
                          : day === 'F'
                            ? 'Fri'
                            : 'Sat'}
              </span>
              <strong>{number}</strong>
            </button>
          ))}
        </div>

        <div className="full-events">
          <AgendaEvent
            time="09:00"
            title="Weekly team standup"
            details="9:00 – 9:30 AM · Google Meet"
            tone="blue"
          />
          <AgendaEvent
            time="10:30"
            title="Design review"
            details="10:30 – 11:30 AM · Meeting room 2"
            tone="violet"
          />
          <AgendaEvent
            time="01:00"
            title="Project catch-up"
            details="1:00 – 1:45 PM · Zoom meeting"
            tone="orange"
          />
        </div>
      </section>
    </section>
  )
}

function AgendaEvent({
  time,
  title,
  details,
  tone,
}: {
  time: string
  title: string
  details: string
  tone: string
}) {
  return (
    <div className="schedule-event-row">
      <span>{time}</span>
      <article className={`event-card event-${tone}`}>
        <i />
        <div>
          <strong>{title}</strong>
          <span>{details}</span>
        </div>
      </article>
    </div>
  )
}
