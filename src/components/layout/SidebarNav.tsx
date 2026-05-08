import {
  ReadOutlined,
  StarFilled,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/personal/profile", label: "Personal", icon: <UserOutlined /> },
  { to: "/team/overview", label: "Team", icon: <TeamOutlined /> },
  { to: "/learn", label: "Learn", icon: <ReadOutlined /> },
  { to: "/activity/all", label: "Activity", icon: <ThunderboltOutlined /> },
];

type SidebarNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav className={collapsed ? "sidebar-nav collapsed" : "sidebar-nav"}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          title={collapsed ? item.label : undefined}
          className={
            location.pathname.startsWith(`/${item.to.split("/")[1]}`)
              ? "sidebar-link active"
              : "sidebar-link"
          }
          onClick={onNavigate}
        >
          <span className="sidebar-icon">{item.icon}</span>
          <span className="sidebar-link-label">{item.label}</span>
          <StarFilled className="sidebar-active-star" />
        </NavLink>
      ))}
    </nav>
  );
}
