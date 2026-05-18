import { createTheme } from "@mui/material/styles";

export function createTalioTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#c69af1" : "#6f2dbd",
        contrastText: mode === "dark" ? "#181326" : "#ffffff",
      },
      error: {
        main: mode === "dark" ? "#ff8d7d" : "#c0392b",
      },
      background: {
        default: mode === "dark" ? "#181326" : "#fbfafc",
        paper: mode === "dark" ? "#211a31" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#f8f5fb" : "#181326",
        secondary: mode === "dark" ? "#beb5cb" : "#655f70",
      },
      divider: mode === "dark" ? "rgb(255 255 255 / 12%)" : "#e6e1eb",
    },
    typography: {
      fontFamily:
        "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      h1: {
        fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
        letterSpacing: 0,
      },
      h2: {
        fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
        letterSpacing: 0,
      },
      h3: {
        fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
        letterSpacing: 0,
      },
      h4: {
        fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
        letterSpacing: 0,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minWidth: 320,
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            backgroundImage:
              "linear-gradient(180deg, color-mix(in srgb, var(--accent) 28%, transparent) 0, transparent 22rem)",
          },
          "html, body, #root": {
            minHeight: "100%",
          },
          "button, input, textarea, select": {
            font: "inherit",
          },
          "h1, h2, h3, h4, p": {
            margin: 0,
          },
          a: {
            color: "inherit",
            textDecoration: "none",
          },
          code: {
            color: "var(--foreground)",
            fontFamily:
              "JetBrains Mono, ui-monospace, SFMono-Regular, Consolas, monospace",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "0.625rem",
            boxShadow: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            color: "var(--foreground)",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "0.875rem",
            boxShadow: "var(--shadow-soft)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            color: "var(--foreground)",
            backgroundImage: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.625rem",
            background: "var(--surface)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "0.875rem",
            color: "var(--foreground)",
            background: "var(--popover)",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            color: "var(--foreground)",
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "0.875rem",
            boxShadow: "var(--shadow-card)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            color: "var(--foreground)",
            background: "var(--popover)",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            color: "var(--muted-foreground)",
            fontWeight: 600,
          },
        },
      },
    },
  });
}
