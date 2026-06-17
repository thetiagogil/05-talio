import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type ChemistryPanelHeadingProps = {
  children: ReactNode;
  description: string;
  icon: ReactNode;
};

export const ChemistryPanelHeading = ({
  children,
  description,
  icon,
}: ChemistryPanelHeadingProps) => (
  <>
    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Box
        sx={{ color: "var(--accent2)", fontSize: "1.2rem", display: "flex" }}
      >
        {icon}
      </Box>
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
    </Box>
    <Typography
      sx={{
        mt: "0.25rem",
        color: "var(--muted-foreground)",
        fontSize: "0.875rem",
      }}
    >
      {description}
    </Typography>
  </>
);
