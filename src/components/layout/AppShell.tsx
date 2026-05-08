import { useEffect, useState, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Drawer, Dropdown } from "antd"
import {
  CloseOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons"
import {
  logout,
  toggleTheme,
  useAppTheme,
  useCurrentUser,
} from "../../lib/talentsStore"
import { AvatarBubble } from "../common/AvatarBubble"
import { NotificationMenu } from "./NotificationMenu"
import { SidebarNav } from "./SidebarNav"

const sidebarKey = "talio.sidebarCollapsed"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const user = useCurrentUser()
  const theme = useAppTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(sidebarKey) === "1"
  })

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
      return
    }

    if (!user.role || !user.avatar) {
      navigate("/setup", { replace: true })
    }
  }, [navigate, user])

  if (!user || !user.role || !user.avatar) return null

  function handleCollapsedChange() {
    setCollapsed((current) => {
      const next = !current
      localStorage.setItem(sidebarKey, next ? "1" : "0")
      return next
    })
  }

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Button
            aria-label="Open menu"
            className="mobile-menu-button"
            shape="circle"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileOpen(true)}
          />
          <Button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="desktop-sidebar-button"
            shape="circle"
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleCollapsedChange}
          />
          <Link className="brand-link" to="/personal">
            <span className="brand-mark">T</span>
            <span className="brand-text">
              <span>
                Talents<span>.</span>
              </span>
              <small>Internal team app</small>
            </span>
          </Link>
        </div>

        <div className="topbar-actions">
          <Button
            aria-label="Toggle theme"
            className="topbar-icon-button"
            shape="circle"
            type="text"
            icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
          />
          <NotificationMenu />
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "user",
                  label: (
                    <div className="account-menu-user">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  ),
                  disabled: true,
                },
                {
                  type: "divider",
                },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Log out",
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <button className="account-trigger" type="button">
              <AvatarBubble value={user.avatar} size={36} />
              <span>
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </span>
            </button>
          </Dropdown>
        </div>
      </header>

      <div className="shell-body">
        <aside className={collapsed ? "desktop-sidebar collapsed" : "desktop-sidebar"}>
          <SidebarNav collapsed={collapsed} />
        </aside>

        <Drawer
          className="mobile-drawer"
          closeIcon={<CloseOutlined />}
          open={mobileOpen}
          placement="left"
          title="Menu"
          onClose={() => setMobileOpen(false)}
        >
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        <main className="shell-main">{children}</main>
      </div>
    </div>
  )
}
