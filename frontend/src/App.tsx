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
import './styles/app.css'

export default function App() {
  const auth = useAuth()
  const sidebar = useSidebar()
  const taskState = useTasks()
  const [activePage, setActivePage] = useState('Dashboard')
  const [showAddTask, setShowAddTask] = useState(false)
  if (!auth.isAuthenticated) return <LoginPage email={auth.email} setEmail={auth.setEmail} password={auth.password} setPassword={auth.setPassword} onSubmit={auth.signIn} />
  const page = activePage === 'Dashboard'
    ? <DashboardPage tasks={taskState.tasks} filteredTasks={taskState.filteredTasks} completedCount={taskState.completedCount} search={taskState.search} onToggleTask={taskState.toggleTask} onAddTask={taskState.addTask} onViewTasks={() => setActivePage('Tasks')} />
    : activePage === 'Tasks'
      ? <TasksPage tasks={taskState.tasks} search={taskState.search} onToggleTask={taskState.toggleTask} onAddTask={() => setShowAddTask(true)} />
      : activePage === 'Schedule' ? <SchedulePage />
        : activePage === 'Setting' ? <SettingPage />
          : <ProjectPage name={activePage} tasks={taskState.tasks} onToggleTask={taskState.toggleTask} />
  return <div className={`app-shell ${sidebar.collapsed ? 'is-collapsed' : ''}`}><Sidebar collapsed={sidebar.collapsed} active={activePage} onNavigate={setActivePage} onToggle={sidebar.toggle} onLogout={auth.signOut} /><main className="main-area"><TopBar active={activePage} search={taskState.search} onSearch={taskState.setSearch} />{page}</main>
    {showAddTask && <div className="modal-backdrop" onClick={() => setShowAddTask(false)}><form className="add-modal" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); taskState.addTask(String(form.get('title') ?? '')); setShowAddTask(false) }} onClick={event => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setShowAddTask(false)}>×</button><span className="eyebrow">NEW TASK</span><h2>What needs to get done?</h2><p>Add a task to your list for today.</p><input name="title" autoFocus placeholder="e.g. Prepare project update" required /><button className="primary-button" type="submit">Create task <span>→</span></button></form></div>}
  </div>
}
