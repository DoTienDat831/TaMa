
import type { Task } from '../hooks/useTasks';

// ==========================================
// Types
// ==========================================

type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void | Promise<void>;
  onEdit?: (task: Task) => void;
  onViewAll?: () => void;
  search?: string;
};

// ==========================================
// Component
// ==========================================

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onViewAll,
  search = '',
}: Props) {
  return (
    <>
      {/* =====================================
          Task List
      ====================================== */}

      <div className="task-list">

        {tasks.map((task) => {
          const isDone = task.done;
          const isDueToday = task.dueToday;

          return (
            <div
              key={task.id}
              className={`task-row ${isDone ? 'task-done' : ''}`}
            >
              {/* Task Checkbox */}
              <button
                className={`task-check ${isDone ? 'checked' : ''}`}
                aria-label={
                  isDone
                    ? 'Mark incomplete'
                    : 'Mark complete'
                }
                onClick={() => onToggle(task.id)}
              >
                {isDone && '✓'}
              </button>

              {/* Task Information */}
              <div className="task-copy">
                <strong>{task.title}</strong>

                <span>
                  <i className={`project-dot ${task.color}`} />
                  {task.project}
                </span>
              </div>

              {/* Due Date */}
              <span
                className={`due-pill ${isDueToday ? 'due-today' : ''}`}
              >
                {isDueToday ? '◷' : '○'}
                &nbsp;
                {task.due}
              </span>

              {/* Task Options */}
              {(onEdit || onDelete) && (
                <div className="task-row-actions">
                  {onEdit && (
                    <button
                      className="row-more task-edit"
                      aria-label={`Edit task ${task.title}`}
                      title="Edit task"
                      onClick={() => onEdit(task)}
                    >
                      ✎
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="row-more task-delete"
                      aria-label={`Delete task ${task.title}`}
                      title="Delete task"
                      onClick={() => {
                        if (window.confirm(`Delete “${task.title}”?`)) void onDelete(task.id)
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="empty-tasks">
            {search
              ? `No tasks match “${search}”.`
              : 'No tasks yet. Add your first task to get started.'}
          </div>
        )}

      </div>

      {/* =====================================
          View All Tasks
      ====================================== */}

      {onViewAll && (
        <button
          className="view-all"
          onClick={onViewAll}
        >
          View all tasks
          <span>→</span>
        </button>
      )}
    </>
  );
}
