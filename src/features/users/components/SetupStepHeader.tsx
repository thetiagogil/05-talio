import { Box, Typography } from "@mui/material";

type SetupStepHeaderProps = {
  step: number;
};

export const SetupStepHeader = ({ step }: SetupStepHeaderProps) => {
  return (
    <Box component="section" sx={{ my: "3rem", textAlign: "center" }}>
      <Typography
        sx={{
          color: "var(--accent2)",
          fontSize: "0.75rem",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Step {step + 1} of 2
      </Typography>
      <Typography
        component="h1"
        sx={{
          mt: "0.75rem",
          color: "var(--foreground)",
          fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
          fontSize: "2.25rem",
          fontWeight: 800,
        }}
      >
        {step === 0 ? "What's your role?" : "Pick your avatar"}
      </Typography>
      <Typography
        component="span"
        sx={{
          display: "block",
          mt: "0.75rem",
          color: "var(--muted-foreground)",
        }}
      >
        {step === 0
          ? "This helps your teammates know what you do."
          : "Choose something that feels like you."}
      </Typography>
    </Box>
  );
};
