// ==========================================
// Types
// ==========================================

type Props = {
  active: string;
  search: string;
  onSearch: (value: string) => void;
};

// ==========================================
// Component
// ==========================================

export default function TopBar({
  active,
  search,
  onSearch,
}: Props) {
  return (
    <header className="topbar">

      {/* =====================================
          Breadcrumb Navigation
      ====================================== */}

      <div className="breadcrumb">
        <span>Workspace</span>
        <b>/</b>
        <strong>{active}</strong>
      </div>

      {/* =====================================
          Top Actions
      ====================================== */}

      <div className="top-actions">

        {/* Search Box */}
        <div className="search-box">
          <span>⌕</span>

          <input
            aria-label="Search tasks"
            placeholder="Search anything..."
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />

          <kbd>⌘ K</kbd>
        </div>

        {/* Notifications */}
        <button
          className="icon-button"
          aria-label="Notifications"
        >
          ♧
          <i />
        </button>

        {/* User Avatar */}
        <div className="top-avatar">
          AC
        </div>

      </div>
    </header>
  );
}
