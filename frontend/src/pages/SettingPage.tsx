
import { useSettings } from '../hooks/useSettings'
import type { ApiUser } from '../api/client'
import '../styles/settings.css'

export default function SettingPage({ user }: { user: ApiUser | null }) {
  const {
    notificationsEnabled,
    setNotificationsEnabled,
    compactTasks,
    setCompactTasks,
  } = useSettings(user?.id ?? null)

  return (
    <section className="page-content settings-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage your account and workspace preferences.</p>
        </div>
      </div>

      <section className="panel settings-card">
        <h2>Profile</h2>
        <p>Your personal account information.</p>

        <div className="settings-profile">
          <div className="avatar">{user?.fullName.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U'}</div>
          <div>
            <strong>{user?.fullName ?? 'User'}</strong>
            <span>{user?.email ?? ''}</span>
          </div>
          <button className="calendar-switch">Edit profile</button>
        </div>
      </section>

      <section className="panel settings-card">
        <h2>Preferences</h2>
        <p>Choose how Tandem works for you.</p>

        <SettingToggle
          title="Notifications"
          description="Get notified about tasks and upcoming events."
          checked={notificationsEnabled}
          onChange={setNotificationsEnabled}
        />

        <SettingToggle
          title="Compact task list"
          description="Show tasks in a tighter, more compact layout."
          checked={compactTasks}
          onChange={setCompactTasks}
        />
      </section>
    </section>
  )
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="setting-row">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  )
}
