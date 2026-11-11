
import type { Task } from '../hooks/useTasks'
import TaskList from '../components/TaskList'
import { useTasksPage } from '../hooks/useTasksPage'
import { useState, type FormEvent } from 'react'
import { currentLocalDateTimeInputValue } from '../utils/dateTime'
import '../styles/tasks.css'

type Props = {
  tasks: Task[]
  search: string
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void | Promise<void>
  onEditTask: (id: string, title: string, deadline: string) => boolean | Promise<boolean>
  onAddTask: () => void
}

export default function TasksPage({
  tasks,
  search,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onAddTask,
}: Props) {
  const { filter, setFilter, visibleTasks } = useTasksPage(tasks, search)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDeadline, setEditDeadline] = useState('')

  const startEditing = (task: Task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    if (task.dueAt) {
      const localDate = new Date(task.dueAt)
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset())
      setEditDeadline(localDate.toISOString().slice(0, 16))
    } else {
      setEditDeadline(currentLocalDateTimeInputValue())
    }
  }

  const saveTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingTask) return
    const saved = await onEditTask(editingTask.id, editTitle, editDeadline)
    if (saved) setEditingTask(null)
  }

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
          onDelete={onDeleteTask}
          onEdit={startEditing}
          search={search}
        />
      </section>
      {editingTask && (
        <div className="modal-backdrop" onClick={() => setEditingTask(null)}>
          <form className="add-modal" onSubmit={saveTask} onClick={event => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setEditingTask(null)}>×</button>
            <span className="eyebrow">EDIT TASK</span>
            <h2>Update task</h2>
            <p>Change the task name or deadline.</p>
            <label htmlFor="edit-task-title">Task name</label>
            <input id="edit-task-title" value={editTitle} onChange={event => setEditTitle(event.target.value)} required />
            <label htmlFor="edit-task-deadline">Deadline</label>
            <input id="edit-task-deadline" type="datetime-local" value={editDeadline} onChange={event => setEditDeadline(event.target.value)} required />
            <button className="primary-button" type="submit">Save changes <span>→</span></button>
          </form>
        </div>
      )}
    </section>
  )
}
