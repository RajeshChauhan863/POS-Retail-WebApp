import { useMemo } from 'react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'pos', label: 'POS', icon: 'pos' },
  { id: 'products', label: 'Products', icon: 'tag' },
  { id: 'inventory', label: 'Inventory', icon: 'boxes' },
  { id: 'customers', label: 'Customers', icon: 'users' },
  { id: 'reports', label: 'Reports', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
]

function Icon({ name }) {
  const common = useMemo(
    () => ({ width: 18, height: 18, viewBox: '0 0 24 24' }),
    [],
  )

  switch (name) {
    case 'grid':
      return (
        <svg {...common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
          />
        </svg>
      )
    case 'pos':
      return (
        <svg {...common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5v2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h2v-2H6a2 2 0 0 1-2-2V6Zm2 0v7h12V6H6Zm5 11v-2h2v2h-2Z"
          />
        </svg>
      )
    case 'tag':
      return (
        <svg {...common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 12l9-9h7a2 2 0 0 1 2 2v7l-9 9L3 12Zm14-7a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3Z"
          />
        </svg>
      )
    case 'boxes':
      return (
        <svg {...common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 4h10a2 2 0 0 1 2 2v4h-2V6H7v4H5V6a2 2 0 0 1 2-2Zm-2 8h6v8H7a2 2 0 0 1-2-2v-6Zm8 0h6v6a2 2 0 0 1-2 2h-4v-8Z"
          />
        </svg>
      )
    case 'users':
      return (
        <svg {...common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 11a4 4 0 1 0-8 0a4 4 0 0 0 8 0ZM4 20a6 6 0 0 1 12 0v1H4v-1Zm14-7h6v2h-6v-2Z"
          />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 19V5a1 1 0 1 1 2 0v14h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm5-3V10a1 1 0 1 1 2 0v6a1 1 0 1 1-2 0Zm5 0V7a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0Z"
          />
        </svg>
      )
    case 'gear':
      return (
        <svg {...common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm9 3.1l-1.9-.7a7.7 7.7 0 0 0-.7-1.7l.9-1.8l-2-2l-1.8.9c-.5-.3-1.1-.5-1.7-.7L13.9 3h-2.8l-.7 1.9c-.6.2-1.2.4-1.7.7l-1.8-.9l-2 2l.9 1.8c-.3.5-.5 1.1-.7 1.7L3 11.6v2.8l1.9.7c.2.6.4 1.2.7 1.7l-.9 1.8l2 2l1.8-.9c.5.3 1.1.5 1.7.7l.7 1.9h2.8l.7-1.9c.6-.2 1.2-.4 1.7-.7l1.8.9l2-2l-.9-1.8c.3-.5.5-1.1.7-1.7l1.9-.7v-2.8ZM12 17a5 5 0 1 1 0-10a5 5 0 0 1 0 10Z"
          />
        </svg>
      )
    default:
      return null
  }
}

export default function Sidebar({ activeId, onNavigate }) {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebar-top">
        <div className="sidebar-brand" role="banner">
          <div className="sidebar-logo" aria-hidden="true">
            PR
          </div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">POS Retail</div>
            <div className="sidebar-brand-subtitle">Store Admin</div>
          </div>
        </div>

        <div className="sidebar-search">
          <input
            className="sidebar-search-input"
            type="search"
            placeholder="Search\u2026"
            aria-label="Search navigation"
          />
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Navigation">
        {navItems.map((item) => {
          const isActive = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item${isActive ? ' is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="sidebar-item-icon" aria-hidden="true">
                <Icon name={item.icon} />
              </span>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">
            A
          </div>
          <div className="sidebar-user-text">
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-subtitle">admin@store.com</div>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-logout"
          onClick={() => onNavigate('logout')}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
