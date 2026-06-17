import { Box, Typography } from "@mui/material";

type SearchPanelModeSummaryProps = {
  compareCount: number;
  compareMode: boolean;
};

export const SearchPanelModeSummary = ({
  compareCount,
  compareMode,
}: SearchPanelModeSummaryProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      borderRadius: "0.625rem",
      p: "0.75rem",
      bgcolor: "color-mix(in oklch, var(--muted) 50%, transparent)",
    }}
  >
    <Box sx={{ display: "grid", gap: "0.15rem" }}>
      <Typography component="strong" sx={{ fontWeight: 700 }}>
        {compareMode ? "Compare teammates" : "Browse teammates"}
      </Typography>
      <Typography
        component="span"
        sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
      >
        {compareMode
          ? `${compareCount}/5 selected`
          : "Open a profile to learn how they work"}
      </Typography>
    </Box>
  </Box>
);
