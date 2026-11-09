import {
    LayoutDashboard,
    LayoutList,
    CalendarRange,
    Settings,
    Menu,
    Pencil,
    Trash2
} from "lucide-react";


// ==========================================
// Types
// ==========================================

type Props = {
  collapsed: boolean;
  active: string;
  onNavigate: (page: string) => void;
  onToggle: () => void;
  onLogout: () => void;
};

// ==========================================
// Navigation Data
// ==========================================

const nav = [
  { name: 'Dashboard', icon:  <LayoutDashboard /> },
  { name: 'Tasks', icon: <LayoutList />, count: '8' },
  { name: 'Schedule', icon: <CalendarRange /> },
  { name: 'Setting', icon: <Settings /> },
];

// ==========================================
// Component
// ==========================================

export default function Sidebar({
  collapsed,
  active,
  onNavigate,
  onToggle,
  onLogout,
}: Props) {
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

            <button aria-label="Add project">
              ＋
            </button>
          </div>

          {/* Project: Website Redesign */}
          <button
            className="project-item"
            onClick={() => onNavigate('Website redesign')}
          >
            <i className="project-dot blue" />
            Website redesign
          </button>

          {/* Project: Marketing */}
          <button
            className="project-item"
            onClick={() => onNavigate('Marketing')}
          >
            <i className="project-dot orange" />
            Marketing
          </button>

          {/* Project: Product Launch */}
          <button
            className="project-item"
            onClick={() => onNavigate('Product launch')}
          >
            <i className="project-dot violet" />
            Product launch
          </button>

          {/* Add Project Button */}
          <button className="project-add">
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
            <div className="avatar">
              AC
            </div>

            <span className="profile-info">
              <strong>Alex Chen</strong>
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
          title="Alex Chen"
          onClick={() => onNavigate('Setting')}
        >
          AC
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
