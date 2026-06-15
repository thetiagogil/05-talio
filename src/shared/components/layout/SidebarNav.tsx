import {
  BoltRounded,
  GroupsRounded,
  MenuBookRounded,
  PersonRounded,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/personal/profile", label: "Personal", icon: <PersonRounded /> },
  { to: "/team/overview", label: "Team", icon: <GroupsRounded /> },
  { to: "/learn", label: "Learn", icon: <MenuBookRounded /> },
  { to: "/activity/all", label: "Activity", icon: <BoltRounded /> },
];

type SidebarNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        "--sidebar-nav-gutter": "0.625rem",
        "--sidebar-item-size": "2.75rem",
        "--sidebar-icon-size": "1.25rem",
        "--sidebar-icon-padding":
          "calc((var(--sidebar-item-size) - var(--sidebar-icon-size)) / 2)",
        display: "grid",
        gap: "0.25rem",
        p: "0.75rem var(--sidebar-nav-gutter)",
      }}
    >
      {navItems.map((item) => (
        <Box
          component={NavLink}
          key={item.to}
          to={item.to}
          title={collapsed ? item.label : undefined}
          onClick={onNavigate}
          sx={{
            position: "relative",
            display: "grid",
            width: "100%",
            height: "var(--sidebar-item-size)",
            minHeight: "var(--sidebar-item-size)",
            gridTemplateColumns: collapsed
              ? "var(--sidebar-icon-size) minmax(0, 0fr)"
              : "var(--sidebar-icon-size) minmax(0, 1fr)",
            alignItems: "center",
            columnGap: collapsed ? 0 : "0.75rem",
            borderRadius: "0.75rem",
            px: "var(--sidebar-icon-padding)",
            color: location.pathname.startsWith(`/${item.to.split("/")[1]}`)
              ? "var(--primary-foreground)"
              : "var(--sidebar-foreground)",
            bgcolor: location.pathname.startsWith(`/${item.to.split("/")[1]}`)
              ? "var(--primary)"
              : "transparent",
            boxShadow: location.pathname.startsWith(`/${item.to.split("/")[1]}`)
              ? "var(--shadow-soft)"
              : "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            overflow: "hidden",
            transition:
              "background 160ms ease, color 160ms ease, column-gap 220ms ease, grid-template-columns 220ms ease",
            "&:hover": {
              bgcolor: location.pathname.startsWith(`/${item.to.split("/")[1]}`)
                ? "var(--primary)"
                : "var(--sidebar-accent)",
            },
            "&:focus-visible": {
              outline:
                "3px solid color-mix(in oklch, var(--primary) 28%, transparent)",
              outlineOffset: "3px",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "grid",
              width: "var(--sidebar-icon-size)",
              flex: "none",
              placeItems: "center",
              "& .MuiSvgIcon-root": {
                fontSize: "var(--sidebar-icon-size)",
              },
            }}
          >
            {item.icon}
          </Box>
          <Box
            component="span"
            sx={{
              minWidth: 0,
              maxWidth: collapsed ? 0 : "9rem",
              overflow: "hidden",
              opacity: collapsed ? 0 : 1,
              textOverflow: "ellipsis",
              transition: "max-width 220ms ease, opacity 160ms ease",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
