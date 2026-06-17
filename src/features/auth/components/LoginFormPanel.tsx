import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import {
  Alert,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { validateLoginEmail } from "@/features/auth/lib/auth-validation";

type LoginFormPanelProps = {
  onDemoLogin: () => void;
  onEmailLogin: (email: string) => string | null;
};

export const LoginFormPanel = ({
  onDemoLogin,
  onEmailLogin,
}: LoginFormPanelProps) => {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setEmailError(null);

    const nextEmail = email.trim();
    const nextEmailError = validateLoginEmail(nextEmail);

    if (nextEmailError) {
      setEmailError(nextEmailError);
      return;
    }

    setError(onEmailLogin(nextEmail));
  };

  return (
    <Box
      component="section"
      sx={{
        display: "grid",
        placeItems: "center",
        p: { xs: "2rem 1rem", md: "3rem" },
        bgcolor: "var(--background)",
      }}
    >
      <Box sx={{ width: "min(100%, 24rem)" }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontSize: "1.875rem",
            fontWeight: 800,
          }}
        >
          Welcome back
        </Typography>
        <Typography
          sx={{
            mt: "0.5rem",
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
          }}
        >
          Sign in with your work email to continue.
        </Typography>

        <Box
          component="form"
          noValidate
          sx={{ mt: "2rem" }}
          onSubmit={handleEmailLogin}
        >
          <TextField
            autoComplete="email"
            fullWidth
            inputMode="email"
            label="Work email"
            placeholder="you@talents.app"
            required
            type="email"
            value={email}
            error={Boolean(emailError)}
            helperText={emailError}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError(null);
              setError(null);
            }}
            sx={{ mb: "1rem" }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{ mb: "0.75rem", borderRadius: "0.625rem" }}
            >
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            disabled={!email.trim()}
            size="large"
            type="submit"
            variant="contained"
            endIcon={<ArrowForwardRounded />}
          >
            Continue
          </Button>
        </Box>

        <Divider
          textAlign="center"
          sx={{
            my: "1.5rem",
            color: "var(--muted-foreground)",
            borderColor: "var(--border)",
            "&::before, &::after": { borderColor: "var(--border)" },
            "& .MuiDivider-wrapper": {
              px: "0.75rem",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
            },
          }}
        >
          or
        </Divider>

        <Button
          endIcon={<ArrowForwardRounded />}
          fullWidth
          size="large"
          variant="outlined"
          onClick={onDemoLogin}
          sx={{ borderStyle: "dashed" }}
        >
          Continue with demo account
        </Button>
      </Box>
    </Box>
  );
};
