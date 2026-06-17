import { Typography } from "@mui/material";

type SearchPanelWarningProps = {
  message: string;
};

export const SearchPanelWarning = ({ message }: SearchPanelWarningProps) => (
  <Typography
    sx={{
      borderRadius: "0.5rem",
      px: "0.75rem",
      py: "0.5rem",
      color: "var(--destructive)",
      bgcolor: "color-mix(in oklch, var(--destructive) 10%, transparent)",
      fontSize: "0.75rem",
    }}
  >
    {message}
  </Typography>
);
