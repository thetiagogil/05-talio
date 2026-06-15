import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type EmptyStateProps = {
  title?: string;
  description: ReactNode;
  large?: boolean;
};

export function EmptyState({ title, description, large }: EmptyStateProps) {
  return (
    <Box
      sx={{
        width: large ? "min(100%, 48rem)" : "auto",
        mx: large ? "auto" : 0,
        border: "2px dashed var(--border)",
        borderRadius: "0.875rem",
        p: large
          ? { xs: "2.5rem 1.25rem", sm: "4rem" }
          : { xs: "1rem", sm: "1.5rem" },
        bgcolor: "var(--surface-2)",
        textAlign: "center",
      }}
    >
      {title && (
        <Typography
          sx={{
            mb: "0.25rem",
            color: "var(--foreground)",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 800,
          }}
        >
          {title}
        </Typography>
      )}
      <Typography
        sx={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
      >
        {description}
      </Typography>
    </Box>
  );
}
