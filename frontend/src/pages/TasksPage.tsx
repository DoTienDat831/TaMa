
import type { Task } from '../hooks/useTasks'
import TaskList from '../components/TaskList'
import { useTasksPage } from '../hooks/useTasksPage'
import '../styles/tasks.css'

type Props = {
  tasks: Task[]
  search: string
  onToggleTask: (id: number) => void
  onAddTask: () => void
}

export default function TasksPage({
  tasks,
  search,
  onToggleTask,
  onAddTask,
}: Props) {
  const { filter, setFilter, visibleTasks } = useTasksPage(tasks, search)

  return (
    <section className="page-content tasks-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h1>Tasks</h1>
          <p>Keep track of everything you need to get done.</p>
        </div>

        <button className="primary-button" onClick={onAddTask}>
          ＋ Add task
        </button>
      </div>

      <div className="task-summary">
        <div>
          <strong>{tasks.filter((task) => !task.done).length}</strong>
          <span>To do</span>
        </div>

        <div>
          <strong>{tasks.filter((task) => task.done).length}</strong>
          <span>Completed</span>
        </div>

        <div>
          <strong>{tasks.length}</strong>
          <span>Total tasks</span>
        </div>
      </div>

      <section className="panel task-page-list">
        <div className="panel-heading">
          <div>
            <h2>All tasks</h2>
            <p>{visibleTasks.length} tasks in your list</p>
          </div>

          <button className="calendar-switch">All projects⌄</button>
        </div>

        <div className="task-tabs page-task-tabs">
          <button
            className={filter === 'All' ? 'selected' : ''}
            onClick={() => setFilter('All')}
          >
            All tasks
          </button>

          <button
            className={filter === 'Today' ? 'selected' : ''}
            onClick={() => setFilter('Today')}
          >
            Today
          </button>

          <button
            className={filter === 'Upcoming' ? 'selected' : ''}
            onClick={() => setFilter('Upcoming')}
          >
            Upcoming
          </button>
        </div>

        <TaskList
          tasks={visibleTasks}
          onToggle={onToggleTask}
          search={search}
        />
      </section>
    </section>
  )
}
