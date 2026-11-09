
import type { Task } from '../hooks/useTasks';

// ==========================================
// Types
// ==========================================

type Props = {
  tasks: Task[];
  onToggle: (id: number) => void;
  onViewAll?: () => void;
  search?: string;
};

// ==========================================
// Component
// ==========================================

export default function TaskList({
  tasks,
  onToggle,
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
          const isDueToday = task.due === 'Today';

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
              <button
                className="row-more"
                aria-label="Task options"
              >
                ···
              </button>
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
