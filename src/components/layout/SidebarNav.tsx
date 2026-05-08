import { NavLink } from "react-router-dom"
import {
  ReadOutlined,
  StarFilled,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons"

const navItems = [
  { to: "/personal", label: "Personal", icon: <UserOutlined /> },
  { to: "/team", label: "Team", icon: <TeamOutlined /> },
  { to: "/learn", label: "Learn", icon: <ReadOutlined /> },
  { to: "/activity", label: "Activity", icon: <ThunderboltOutlined /> },
]

type SidebarNavProps = {
  collapsed?: boolean
  onNavigate?: () => void
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  return (
    <nav className={collapsed ? "sidebar-nav collapsed" : "sidebar-nav"}>
      {!collapsed && <p className="sidebar-label">Workspace</p>}

      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          title={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          onClick={onNavigate}
        >
          <span className="sidebar-icon">{item.icon}</span>
          {!collapsed && (
            <>
              <span>{item.label}</span>
              <StarFilled className="sidebar-active-star" />
            </>
          )}
        </NavLink>
      ))}

      {!collapsed && (
        <aside className="sidebar-tip">
          <p>Tip of the day</p>
          <span>
            Send kudos to a teammate when you spot one of their talents in the
            wild.
          </span>
        </aside>
      )}
    </nav>
  )
}
