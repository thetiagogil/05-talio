import { Typography } from "@mui/material";
import type { ReactNode } from "react";

export const TeamPanelTitle = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      component="h3"
      sx={{
        color: "var(--foreground)",
        fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
        fontSize: "1.25rem",
        fontWeight: 700,
      }}
    >
      {children}
    </Typography>
  );
};

export const TeamPanelDescription = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      sx={{
        mt: "0.25rem",
        color: "var(--muted-foreground)",
        fontSize: "0.875rem",
      }}
    >
      {children}
    </Typography>
  );
};
