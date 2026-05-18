import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import StarBorderRounded from "@mui/icons-material/StarBorderRounded";
import {
  Alert,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import {
  continueWithTestUser,
  loginByEmail,
  useCurrentUser,
} from "@/features/auth/hooks/useAuth";
import type { User } from "@/types/talents";

export function LoginScreen() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate(nextRoute(user), { replace: true });
  }, [navigate, user]);

  function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setEmailError(null);

    const nextEmail = email.trim();

    if (!nextEmail) {
      setEmailError("Enter your work email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    const nextUser = loginByEmail(nextEmail);

    if (!nextUser) {
      setError("We couldn't find that email. Try the test user below.");
      return;
    }

    navigate(nextRoute(nextUser), { replace: true });
  }

  function handleTestLogin() {
    const nextUser = continueWithTestUser();
    navigate(nextRoute(nextUser), { replace: true });
  }

  return (
    <Box
      component="main"
      sx={{
        display: "grid",
        minHeight: "100vh",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
      }}
    >
      <Box
        component="aside"
        sx={{
          position: "relative",
          display: "flex",
          minHeight: { xs: "38rem", sm: "44rem", md: "100vh" },
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          p: { xs: "2rem", md: "3.5rem" },
          color: "var(--foreground)",
          background:
            "linear-gradient(135deg, var(--surface) 0, var(--accent) 52%, color-mix(in srgb, var(--domain-strategic-soft) 55%, var(--surface)) 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Box
            component="img"
            src="/favicon.svg"
            alt="Talio"
            sx={{
              display: "block",
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: 999,
            }}
          />
          <Typography
            component="strong"
            sx={{
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontWeight: 700,
            }}
          >
            Talio
          </Typography>
        </Box>

        <Box component="section" sx={{ maxWidth: "35rem" }}>
          <Typography
            component="p"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              mb: "1.5rem",
              borderRadius: 999,
              px: "0.75rem",
              py: "0.25rem",
              color: "var(--accent-foreground)",
              bgcolor: "var(--accent)",
              boxShadow:
                "0 0 0 1px color-mix(in srgb, var(--primary) 18%, transparent)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <StarBorderRounded fontSize="small" />
            Built for people-first teams
          </Typography>
          <Typography
            component="h1"
            sx={{
              maxWidth: "42rem",
              fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.04,
            }}
          >
            Know your strengths.
            <br />
            Grow with your team.
          </Typography>
          <Typography
            sx={{
              maxWidth: "27rem",
              mt: "1.25rem",
              color: "var(--muted-foreground)",
              fontSize: "1.125rem",
              lineHeight: 1.65,
            }}
          >
            Discover what makes you tick, share how you work best, and find
            common ground with the people around you.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              mt: "2.5rem",
            }}
          >
            {["Executing", "Influencing", "Relationships", "Strategy"].map(
              (label) => (
                <Box
                  component="span"
                  key={label}
                  sx={{
                    borderRadius: 999,
                    px: "0.9rem",
                    py: "0.45rem",
                    bgcolor: "var(--surface)",
                    boxShadow: "0 0 0 1px var(--border)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Box>
              ),
            )}
          </Box>
        </Box>

        <Typography
          sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
        >
          &copy; Talio &middot; People team app
        </Typography>
      </Box>

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

          <Box component="form" sx={{ mt: "2rem" }} onSubmit={handleEmailLogin}>
            <TextField
              fullWidth
              label="Work email"
              placeholder="you@talents.app"
              value={email}
              error={Boolean(emailError)}
              helperText={emailError}
              onChange={(event) => setEmail(event.target.value)}
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
            fullWidth
            size="large"
            variant="outlined"
            onClick={handleTestLogin}
            sx={{ borderStyle: "dashed" }}
          >
            Continue with test user
          </Button>

          <Typography
            sx={{
              mt: "2rem",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
              lineHeight: 1.6,
              "& code": { color: "var(--foreground)", fontSize: "0.72rem" },
            }}
          >
            Tip: try <code>sofia@talents.app</code>,{" "}
            <code>marcus@talents.app</code>, or any seeded teammate.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function nextRoute(user: User) {
  return user.role && user.avatar ? "/personal/profile" : "/setup";
}
