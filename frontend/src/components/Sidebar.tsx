import {
    LayoutDashboard,
    LayoutList,
    CalendarRange,
    Settings,
} from "lucide-react";
import type { ApiProject, ApiUser } from '../api/client'


// ==========================================
// Types
// ==========================================

type Props = {
  collapsed: boolean;
  active: string;
  onNavigate: (page: string) => void;
  onToggle: () => void;
  onLogout: () => void;
  projects: ApiProject[];
  user: ApiUser | null;
  taskCount: number;
  onAddProject: () => void;
};

// ==========================================
// Component
// ==========================================

export default function Sidebar({
  collapsed,
  active,
  onNavigate,
  onToggle,
  onLogout,
  projects,
  user,
  taskCount,
  onAddProject,
}: Props) {
  const initials = user?.fullName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const nav = [
    { name: 'Dashboard', icon: <LayoutDashboard /> },
    { name: 'Tasks', icon: <LayoutList />, count: String(taskCount) },
    { name: 'Schedule', icon: <CalendarRange /> },
    { name: 'Setting', icon: <Settings /> },
  ]
  return (
    <aside className="sidebar">

      {/* =====================================
          Brand Logo
      ====================================== */}

      <div className="side-brand">
        <div className="brand brand-light">
          <span className="brand-mark">t</span>

          {!collapsed && (
            <span>Tama</span>
          )}
        </div>
      </div>

      {/* =====================================
          Workspace Label
      ====================================== */}

      {!collapsed && (
        <div className="workspace-label">
          WORKSPACE
        </div>
      )}

      {/* =====================================
          Main Navigation
      ====================================== */}

      <nav className="side-nav">
        {nav.map((item) => {
          const isActive = active === item.name;

          return (
            <button
              key={item.name}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.name)}
              title={collapsed ? item.name : undefined}
            >
              <span
                className="nav-icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>

              {!collapsed && (
                <>
                  <span>{item.name}</span>

                  {item.count && (
                    <span className="nav-count">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* =====================================
          Projects Section
      ====================================== */}

      {!collapsed && (
        <div className="side-section">

          {/* Section Header */}
          <div className="section-label">
            YOUR PROJECTS

            <button aria-label="Add project" onClick={onAddProject}>
              ＋
            </button>
          </div>

          {projects.map(project => (
            <button key={project.id} className="project-item" onClick={() => onNavigate(project.name)}>
              <i className={`project-dot ${project.color || 'blue'}`} />
              {project.name}
            </button>
          ))}

          {/* Add Project Button */}
          <button className="project-add" onClick={onAddProject}>
            ＋ &nbsp;Add project
          </button>

        </div>
      )}

      {/* =====================================
          Sidebar Bottom Section
      ====================================== */}

      {!collapsed && (
        <div className="sidebar-bottom">

          {/* Upgrade Card */}
          <div className="upgrade-card">
            <span className="upgrade-icon">
              ✦
            </span>

            <strong>
              Make space for more
            </strong>

            <span>
              Upgrade your workspace plan.
            </span>

            <button>
              Explore plans
              <span>→</span>
            </button>
          </div>

          {/* User Profile */}
          <button
            className="profile"
            onClick={() => onNavigate('Setting')}
          >
            <div className="avatar">{initials}</div>

            <span className="profile-info">
                <strong>{user?.fullName ?? 'User'}</strong>
              <small>Free plan</small>
            </span>

            <span className="profile-menu">
              ···
            </span>
          </button>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            <span aria-hidden="true">↪</span>
            Sign out
          </button>

        </div>
      )}

      {/* =====================================
          Collapsed Sidebar Avatar
      ====================================== */}

      {collapsed && (
        <button
          className="collapsed-avatar"
          title={user?.fullName ?? 'User'}
          onClick={() => onNavigate('Setting')}
        >
          {initials}
        </button>
      )}

      {/* =====================================
          Collapse / Expand Button
      ====================================== */}

      <button
        className="collapse-button"
        aria-label={
          collapsed
            ? 'Expand sidebar'
            : 'Collapse sidebar'
        }
        aria-expanded={!collapsed}
        onClick={onToggle}
      >
        {collapsed ? '»' : '«'}
      </button>

    </aside>
  );
}
