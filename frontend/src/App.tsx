import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import LoginPage from './components/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import SchedulePage from './pages/SchedulePage'
import SettingPage from './pages/SettingPage'
import ProjectPage from './pages/ProjectPage'
import { useAuth } from './hooks/useAuth'
import { useSidebar } from './hooks/useSidebar'
import { useTasks } from './hooks/useTasks'
import { useDashboardSummary } from './hooks/useDashboardSummary'
import { useSchedule } from './hooks/useSchedule'
import { currentLocalDateTimeInputValue } from './utils/dateTime'
import './styles/app.css'

export default function App() {
  const auth = useAuth()
  const sidebar = useSidebar()
  const taskState = useTasks(auth.user?.id ?? null, auth.workspaceId)
  const dashboardSummary = useDashboardSummary(auth.workspaceId, `${taskState.tasks.length}:${taskState.completedCount}`)
  const scheduleState = useSchedule(auth.workspaceId)
  const addTask = async (title: string, deadline: string) => {
    await taskState.addTask(title, deadline)
    await scheduleState.reload()
  }
  const deleteTask = async (id: string) => {
    await taskState.deleteTask(id)
    await scheduleState.reload()
  }
  const updateTask = async (id: string, title: string, deadline: string) => {
    const saved = await taskState.updateTask(id, title, deadline)
    await scheduleState.reload()
    return saved
  }
  const [activePage, setActivePage] = useState('Dashboard')
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskDeadline, setTaskDeadline] = useState(currentLocalDateTimeInputValue)
  const [showAddProject, setShowAddProject] = useState(false)
  if (!auth.isAuthenticated) return <LoginPage email={auth.email} setEmail={auth.setEmail} password={auth.password} setPassword={auth.setPassword} fullName={auth.fullName} setFullName={auth.setFullName} isRegistering={auth.isRegistering} setIsRegistering={auth.setIsRegistering} error={auth.error} isLoading={auth.isLoading} onSubmit={auth.signIn} />
  const page = activePage === 'Dashboard'
    ? <DashboardPage tasks={taskState.tasks} filteredTasks={taskState.filteredTasks} completedCount={dashboardSummary?.completedTasks ?? taskState.completedCount} summary={dashboardSummary} schedule={scheduleState} search={taskState.search} onToggleTask={taskState.toggleTask} onAddTask={addTask} onViewTasks={() => setActivePage('Tasks')} onViewSchedule={() => setActivePage('Schedule')} userName={auth.user?.fullName ?? 'there'} />
    : activePage === 'Tasks'
      ? <TasksPage tasks={taskState.tasks} search={taskState.search} onToggleTask={taskState.toggleTask} onDeleteTask={deleteTask} onEditTask={updateTask} onAddTask={() => setShowAddTask(true)} />
      : activePage === 'Schedule' ? <SchedulePage schedule={scheduleState} />
        : activePage === 'Setting' ? <SettingPage user={auth.user} />
          : <ProjectPage name={activePage} tasks={taskState.tasks} onToggleTask={taskState.toggleTask} />
  return <div className={`app-shell ${sidebar.collapsed ? 'is-collapsed' : ''}`}><Sidebar collapsed={sidebar.collapsed} active={activePage} onNavigate={setActivePage} onToggle={sidebar.toggle} onLogout={auth.signOut} projects={taskState.projects} user={auth.user} taskCount={taskState.tasks.length} onAddProject={() => setShowAddProject(true)} /><main className="main-area"><TopBar active={activePage} search={taskState.search} onSearch={taskState.setSearch} />{taskState.error && <p className="api-error" role="alert">{taskState.error}</p>}{taskState.loading && <p className="api-loading">Loading workspace…</p>}{page}</main>
    {showAddTask && <div className="modal-backdrop" onClick={() => setShowAddTask(false)}><form className="add-modal" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); void addTask(String(form.get('title') ?? ''), String(form.get('deadline') ?? '')); setShowAddTask(false); setTaskDeadline(currentLocalDateTimeInputValue()) }} onClick={event => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowAddTask(false)}>×</button><span className="eyebrow">NEW TASK</span><h2>What needs to get done?</h2><p>Add a task and choose its deadline.</p><label htmlFor="task-title">Task name</label><input id="task-title" name="title" autoFocus placeholder="e.g. Prepare project update" required /><label htmlFor="task-deadline">Deadline</label><input id="task-deadline" name="deadline" type="datetime-local" value={taskDeadline} onChange={event => setTaskDeadline(event.target.value)} required /><button className="primary-button" type="submit">Create task <span>→</span></button></form></div>}
    {showAddProject && <div className="modal-backdrop" onClick={() => setShowAddProject(false)}><form className="add-modal" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); void taskState.addProject(String(form.get('name') ?? '')); setShowAddProject(false) }} onClick={event => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowAddProject(false)}>×</button><span className="eyebrow">NEW PROJECT</span><h2>Create a project</h2><p>Give your work a place to live.</p><input name="name" autoFocus placeholder="e.g. Website redesign" required /><button className="primary-button" type="submit">Create project <span>→</span></button></form></div>}
  </div>
}
