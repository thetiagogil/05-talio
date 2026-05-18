import {
  DarkModeRounded,
  LightModeRounded,
  LogoutRounded,
  MenuOpenRounded,
  MenuRounded,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationMenu } from "@/features/notifications/components/NotificationMenu";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { STORAGE_KEYS } from "@/lib/constants/storageKeys";
import { logout, useCurrentUser } from "@/features/auth/hooks/useAuth";
import { toggleTheme, useAppTheme } from "@/theme/theme-storage";
import { SidebarNav } from "./SidebarNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const user = useCurrentUser();
  const theme = useAppTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "1";
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user.role || !user.avatar) {
      navigate("/setup", { replace: true });
    }
  }, [navigate, user]);

  if (!user || !user.role || !user.avatar) return null;

  function handleCollapsedChange() {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, next ? "1" : "0");
      return next;
    });
  }

  function handleLogout() {
    logout();
    setAccountAnchor(null);
    navigate("/login", { replace: true });
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "var(--background)",
        backgroundImage:
          "linear-gradient(180deg, var(--surface) 0, var(--background) 18rem)",
      }}
    >
      <Box
        component="header"
        sx={{
          zIndex: 30,
          display: "flex",
          height: "4rem",
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          borderBottom: "1px solid var(--border)",
          px: { xs: "0.75rem", md: "1rem" },
          bgcolor: "color-mix(in srgb, var(--surface) 86%, transparent)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <IconButton
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: "var(--foreground)",
              "&:hover": { color: "var(--primary)", bgcolor: "transparent" },
            }}
          >
            <MenuRounded />
          </IconButton>
          <Box
            component={Link}
            to="/personal/profile"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
            }}
          >
            <Box
              component="img"
              src="/favicon.svg"
              alt="Talio"
              sx={{
                width: "2.25rem",
                height: "2.25rem",
                flex: "none",
                borderRadius: 999,
              }}
            />
            <Box sx={{ display: { xs: "none", md: "grid" }, gap: "0.15rem" }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                Talio
                <Box component="span" sx={{ color: "var(--accent2)" }}>
                  .
                </Box>
              </Typography>
              <Typography
                component="small"
                sx={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                People team app
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "0.2rem", md: "0.5rem" },
          }}
        >
          <IconButton
            aria-label="Toggle theme"
            onClick={toggleTheme}
            sx={{
              color: "var(--foreground)",
              "&:hover": { color: "var(--primary)", bgcolor: "transparent" },
            }}
          >
            {theme === "light" ? <DarkModeRounded /> : <LightModeRounded />}
          </IconButton>
          <NotificationMenu />
          <Box
            component="button"
            type="button"
            onClick={(event) => setAccountAnchor(event.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.55rem",
              border: 0,
              borderRadius: 999,
              p: { xs: "0.25rem", md: "0.25rem 0.75rem 0.25rem 0.25rem" },
              color: "var(--foreground)",
              bgcolor: "transparent",
              cursor: "pointer",
              "&:hover": { color: "var(--primary)", bgcolor: "transparent" },
            }}
          >
            <AvatarBubble value={user.avatar} size={36} />
            <Box
              sx={{ display: { xs: "none", md: "grid" }, textAlign: "left" }}
            >
              <Typography
                component="strong"
                sx={{ fontSize: "0.875rem", lineHeight: 1.1 }}
              >
                {user.name}
              </Typography>
              <Typography
                component="small"
                sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
              >
                {user.role}
              </Typography>
            </Box>
          </Box>
          <Menu
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={() => setAccountAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ display: "grid", gap: "0.2rem", px: 2, py: 1 }}>
              <Typography component="strong" sx={{ fontSize: "0.875rem" }}>
                {user.name}
              </Typography>
              <Typography
                component="span"
                sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
              >
                {user.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutRounded fontSize="small" sx={{ mr: 1 }} />
              Log out
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box sx={{ display: "flex", minHeight: 0, flex: 1 }}>
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "flex" },
            width: collapsed ? "calc(2.75rem + (0.625rem * 2) + 1px)" : "15rem",
            minHeight: 0,
            flexDirection: "column",
            flexShrink: 0,
            overflow: "hidden",
            borderRight: "1px solid var(--sidebar-border)",
            bgcolor: "var(--sidebar)",
            transition: "width 220ms ease",
          }}
        >
          <Box sx={{ minHeight: 0, flex: 1, overflowY: "auto" }}>
            <SidebarNav collapsed={collapsed} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexShrink: 0,
              justifyContent: "flex-start",
              borderTop: "1px solid var(--sidebar-border)",
              p: "0.75rem 0.625rem",
            }}
          >
            <IconButton
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={handleCollapsedChange}
              sx={{
                width: "2.75rem",
                height: "2.75rem",
                color: "var(--sidebar-foreground)",
                "&:hover": {
                  color: "var(--primary)",
                  bgcolor: "var(--sidebar-accent)",
                },
              }}
            >
              <MenuOpenRounded
                sx={{ transform: collapsed ? "scaleX(-1)" : "none" }}
              />
            </IconButton>
          </Box>
        </Box>

        <Drawer
          open={mobileOpen}
          anchor="left"
          onClose={() => setMobileOpen(false)}
          slotProps={{ paper: { sx: { width: "18rem" } } }}
        >
          <Typography
            sx={{
              px: "1rem",
              pt: "1rem",
              pb: "0.25rem",
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontWeight: 800,
            }}
          >
            Menu
          </Typography>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        <Box component="main" sx={{ minWidth: 0, flex: 1, overflowY: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
