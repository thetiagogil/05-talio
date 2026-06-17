import { Box, Card, Typography } from "@mui/material";
import type { ReactNode } from "react";

type ActivityStatProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  tone: "accent" | "done" | "relationship" | "strategic";
};

export const ActivityStat = ({
  icon,
  label,
  value,
  tone,
}: ActivityStatProps) => {
  const styles = {
    accent: {
      color: "var(--accent2)",
      bg: "color-mix(in oklch, var(--accent2) 10%, transparent)",
    },
    done: {
      color: "var(--progress-done)",
      bg: "var(--progress-done-soft)",
    },
    relationship: {
      color: "var(--domain-relationship)",
      bg: "var(--domain-relationship-soft)",
    },
    strategic: {
      color: "var(--domain-strategic)",
      bg: "var(--domain-strategic-soft)",
    },
  }[tone];

  return (
    <Card sx={{ p: "1rem", borderRadius: "0.875rem", boxShadow: "none" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <Box
          component="span"
          sx={{
            display: "grid",
            width: "2rem",
            height: "2rem",
            flex: "none",
            placeItems: "center",
            borderRadius: "0.75rem",
            color: styles.color,
            bgcolor: styles.bg,
          }}
        >
          {icon}
        </Box>
        <Box
          component="span"
          sx={{ display: "grid", gap: "0.25rem", minWidth: 0 }}
        >
          <Typography
            component="strong"
            sx={{
              display: "block",
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography
            component="small"
            sx={{ color: "var(--muted-foreground)", lineHeight: 1.25 }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
