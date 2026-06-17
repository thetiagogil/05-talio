import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type TeamSectionHeadingProps = {
  children: ReactNode;
  description: string;
};

export const TeamSectionHeading = ({
  children,
  description,
}: TeamSectionHeadingProps) => {
  return (
    <Box sx={{ display: "grid", gap: "0.25rem" }}>
      <Typography
        component="h2"
        sx={{
          color: "var(--foreground)",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "1.25rem",
          fontWeight: 700,
        }}
      >
        {children}
      </Typography>
      <Typography
        sx={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
      >
        {description}
      </Typography>
    </Box>
  );
};
