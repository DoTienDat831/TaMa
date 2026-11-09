
import { useState, type FormEvent } from 'react';

import type { Task } from '../hooks/useTasks';
import { useDashboard } from '../hooks/useDashboard';

import TaskList from '../components/TaskList';

import '../styles/dashboard.css';

import {
    LayoutDashboard,
    LayoutList,
    CalendarRange,
    Settings,
    Check,
    ChartColumn,
    Clock3
} from "lucide-react";

// ==========================================
// Types
// ==========================================

type Props = {
  tasks: Task[];
  filteredTasks: Task[];
  completedCount: number;
  search: string;
  onToggleTask: (id: number) => void;
  onAddTask: (title: string) => void;
  onViewTasks: () => void;
};

// ==========================================
// Dashboard Page
// ==========================================

export default function DashboardPage({
  tasks,
  filteredTasks,
  completedCount,
  search,
  onToggleTask,
  onAddTask,
  onViewTasks,
}: Props) {
  // ----------------------------------------
  // Hooks & State
  // ----------------------------------------

  const {
    showAddTask: showAdd,
    openAddTask,
    closeAddTask,
  } = useDashboard();

  const [title, setTitle] = useState('');

  // ----------------------------------------
  // Handlers
  // ----------------------------------------

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAddTask(title);

    setTitle('');
    closeAddTask();
  };

  // ========================================
  // Render
  // ========================================

  return (
    <div className="dashboard-content">

      {/* =====================================
          Welcome Section
      ====================================== */}

      <div className="welcome-row">
        <div>
          <div className="date-line">
            MONDAY, OCTOBER 21, 2024
            <span>☀</span>
          </div>

          <h1>
            Good morning, Alex
            <span className="wave">✦</span>
          </h1>

          <p>
            Here's what's happening with your work today.
          </p>
        </div>

        <button className="primary-button" onClick={openAddTask}>
          ＋ Add task
        </button>
      </div>

      {/* =====================================
          Statistics Section
      ====================================== */}

      <section className="stat-grid">

        {/* My Tasks */}
        <article className="stat-card">
          <div className="stat-title">
            MY TASKS
            <span className="stat-icon blue-soft"><LayoutDashboard /></span>
          </div>

          <div className="stat-value">
            {tasks.length + 4}
            <span className="stat-change">↗ 12%</span>
          </div>

          <div className="stat-note">
            vs. last week
          </div>

          <div className="sparkline spark-blue">
            <svg viewBox="0 0 130 40">
              <path d="M2 31 C15 29 18 10 32 18 S51 28 61 16 78 20 87 12 107 20 116 8 124 13 130 3" />
            </svg>
          </div>
        </article>

        {/* Completed Tasks */}
        <article className="stat-card">
          <div className="stat-title">
            COMPLETED
            <span className="stat-icon green-soft"><Check /></span>
          </div>

          <div className="stat-value">
            {completedCount + 12}
            <span className="stat-change">↗ 8%</span>
          </div>

          <div className="stat-note">
            vs. last week
          </div>

          <div className="sparkline spark-green">
            <svg viewBox="0 0 130 40">
              <path d="M2 33 C13 32 21 22 31 25 S48 18 58 25 72 12 85 18 99 10 108 14 121 2 130 7" />
            </svg>
          </div>
        </article>

        {/* Upcoming Tasks */}
        <article className="stat-card">
          <div className="stat-title">
            UPCOMING
            <span className="stat-icon purple-soft"><ChartColumn /></span>
          </div>

          <div className="stat-value">
            {tasks.length + 2}
            <span className="stat-unit">tasks</span>
          </div>

          <div className="stat-note">
            Due in the next 7 days
          </div>

          <div className="mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>

        {/* Focus Time */}
        <article className="stat-card focus-stat">
          <div className="stat-title">
            FOCUS TIME
            <span className="stat-icon amber-soft"><Clock3 /></span>
          </div>

          <div className="stat-value">
            4.5
            <span className="stat-unit">hrs</span>
          </div>

          <div className="stat-note">
            of 6 hour daily goal
          </div>

          <div className="focus-track">
            <span />
          </div>

          <div className="focus-foot">
            <span>75% of daily goal</span>
            <strong>+30m</strong>
          </div>
        </article>

      </section>

      {/* =====================================
          Main Content
      ====================================== */}

      <div className="content-grid">

        {/* Task Panel */}
        <section className="panel task-panel">

          <div className="panel-heading">
            <div>
              <h2>My tasks</h2>

              <p>
                You have{' '}
                <strong>
                  {tasks.filter((task) => !task.done).length} tasks
                </strong>
                {' '}to complete today
              </p>
            </div>

            <button
              className="more-button"
              aria-label="More task options"
            >
              ···
            </button>
          </div>

          {/* Task Tabs */}
          <div className="task-tabs">
            <button className="selected">
              All tasks
              <span>{tasks.length}</span>
            </button>

            <button>
              Today
              <span>4</span>
            </button>

            <button>
              Upcoming
            </button>

            <button className="filter-button">
              ☷
              <span>Filter</span>
            </button>
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            onToggle={onToggleTask}
            onViewAll={onViewTasks}
            search={search}
          />

        </section>

        {/* Agenda Panel */}
        <AgendaCard />

      </div>

      {/* =====================================
          Dashboard Footer
      ====================================== */}

      <footer className="dashboard-footer">
        <span>
          Made for focused work
          <b>✦</b>
        </span>

        <span>
          Need a hand?{' '}
          <a href="#help">Visit our help center</a>
        </span>
      </footer>

      {/* =====================================
          Add Task Modal
      ====================================== */}

      {showAdd && (
        <div
          className="modal-backdrop"
          onClick={closeAddTask}
        >
          <form
            className="add-modal"
            onSubmit={submit}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="modal-close"
              onClick={closeAddTask}
            >
              ×
            </button>

            {/* Modal Heading */}
            <span className="eyebrow">
              NEW TASK
            </span>

            <h2>What needs to get done?</h2>

            <p>
              Add a task to your list for today.
            </p>

            {/* Task Input */}
            <input
              autoFocus
              placeholder="e.g. Prepare project update"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            {/* Submit Button */}
            <button
              className="primary-button"
              type="submit"
            >
              Create task
              <span>→</span>
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

// ==========================================
// Agenda Card Component
// ==========================================

function AgendaCard() {
  // ----------------------------------------
  // Week Data
  // ----------------------------------------

  const weekDays = [
    ['S', '20'],
    ['M', '21'],
    ['T', '22'],
    ['W', '23'],
    ['T', '24'],
    ['F', '25'],
    ['S', '26'],
  ];

  // ========================================
  // Render
  // ========================================

  return (
    <section className="panel agenda-panel">

      {/* =====================================
          Agenda Header
      ====================================== */}

      <div className="panel-heading">
        <div>
          <h2>Today's agenda</h2>
          <p>Monday, October 21</p>
        </div>

        <button className="calendar-switch">
          October 2024⌄
        </button>
      </div>

      {/* =====================================
          Week Calendar
      ====================================== */}

      <div className="week-strip">
        {weekDays.map(([day, number], index) => {
          const isActive = index === 1;

          return (
            <button
              key={index}
              className={isActive ? 'day-active' : ''}
            >
              <span>{day}</span>
              <strong>{number}</strong>

              {isActive && <i />}
            </button>
          );
        })}
      </div>

      {/* =====================================
          Agenda Events
      ====================================== */}

      <div className="agenda-events">

        {/* Event 1 */}
        <div className="time-label">
          09:00
        </div>

        <article className="event-card event-blue">
          <i />

          <div>
            <strong>Weekly team standup</strong>
            <span>
              9:00 – 9:30 AM · Google Meet
            </span>
          </div>

          <b>30m</b>
        </article>

        {/* Event 2 */}
        <div className="time-label">
          10:30
        </div>

        <article className="event-card event-violet">
          <i />

          <div>
            <strong>Design review</strong>
            <span>
              10:30 – 11:30 AM · Meeting room 2
            </span>
          </div>

          <b>1h</b>
        </article>

        {/* Event 3 */}
        <div className="time-label">
          01:00
        </div>

        <article className="event-card event-orange">
          <i />

          <div>
            <strong>Project catch-up</strong>
            <span>
              1:00 – 1:45 PM · Zoom meeting
            </span>
          </div>

          <b>45m</b>
        </article>

      </div>

      {/* =====================================
          View Full Schedule
      ====================================== */}

      <button className="view-all">
        View full schedule
        <span>→</span>
      </button>

    </section>
  );
}
