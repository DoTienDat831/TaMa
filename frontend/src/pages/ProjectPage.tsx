
import type { Task } from '../hooks/useTasks';

import TaskList from '../components/TaskList';
import { useProjectPage } from '../hooks/useProjectPage';

import '../styles/tasks.css';

// ==========================================
// Types
// ==========================================

type Props = {
  name: string;
  tasks: Task[];
  onToggleTask: (id: number) => void;
};

// ==========================================
// Project Page
// ==========================================

export default function ProjectPage({
  name,
  tasks,
  onToggleTask,
}: Props) {
  // ----------------------------------------
  // Hooks
  // ----------------------------------------

  const projectTasks = useProjectPage(name, tasks);

  // ========================================
  // Render
  // ========================================

  return (
    <section className="page-content tasks-page">

      {/* =====================================
          Page Header
      ====================================== */}

      <div className="page-header">
        <div>
          <span className="eyebrow">
            PROJECT
          </span>

          <h1>{name}</h1>

          <p>
            Tasks and updates for this project.
          </p>
        </div>
      </div>

      {/* =====================================
          Project Tasks
      ====================================== */}

      <section className="panel task-page-list">

        <div className="panel-heading">
          <div>
            <h2>Project tasks</h2>

            <p>
              {projectTasks.length} tasks
            </p>
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={projectTasks}
          onToggle={onToggleTask}
        />

      </section>

    </section>
  );
}
