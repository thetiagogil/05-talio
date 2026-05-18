import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { AVATAR_OPTIONS, DEFAULT_AVATAR } from "@/features/users/data/avatars";
import { ROLES } from "@/features/talents/constants";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { updateUser } from "@/features/users/hooks/useUsers";
import type { RoleName } from "@/types/talents";

export function SetupFlow() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<RoleName | null>(user?.role ?? null);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role && user.avatar)
      navigate("/personal/profile", { replace: true });
  }, [navigate, user]);

  if (!user) return null;

  const currentUser = user;

  function submit() {
    if (!role || !avatar) return;

    updateUser(currentUser.id, { role, avatar });
    navigate("/personal/profile", { replace: true });
  }

  return (
    <Box
      component="main"
      sx={{ minHeight: "100vh", bgcolor: "var(--background)" }}
    >
      <Box
        sx={{
          display: "flex",
          width: "min(100%, 48rem)",
          minHeight: "100vh",
          mx: "auto",
          flexDirection: "column",
          px: { xs: "1rem", sm: "1.5rem" },
          py: "2.5rem",
        }}
      >
        <Stepper
          activeStep={step}
          alternativeLabel
          sx={{ width: "12rem", mx: "auto" }}
        >
          <Step>
            <StepLabel />
          </Step>
          <Step>
            <StepLabel />
          </Step>
        </Stepper>

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

        <Box component="section" sx={{ flex: 1 }}>
          {step === 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: "0.75rem",
              }}
            >
              {ROLES.map((option) => {
                const active = role === option;

                return (
                  <Box
                    component="button"
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    sx={{
                      position: "relative",
                      display: "grid",
                      minHeight: "9rem",
                      placeItems: "center",
                      gap: "0.5rem",
                      border: "2px solid",
                      borderColor: active ? "var(--primary)" : "var(--border)",
                      borderRadius: "0.75rem",
                      p: "1.25rem",
                      color: "var(--foreground)",
                      bgcolor: active
                        ? "color-mix(in oklch, var(--primary) 5%, var(--card))"
                        : "var(--card)",
                      boxShadow: active
                        ? "0 0 0 4px color-mix(in oklch, var(--primary) 15%, transparent)"
                        : "none",
                      cursor: "pointer",
                      transition:
                        "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                      "&:hover": { boxShadow: "var(--shadow-card)" },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "grid",
                        width: "3rem",
                        height: "3rem",
                        placeItems: "center",
                        borderRadius: "0.75rem",
                        color: active ? "var(--primary-foreground)" : "inherit",
                        bgcolor: active ? "var(--primary)" : "var(--muted)",
                        fontFamily:
                          "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                        fontSize: "1.125rem",
                        fontWeight: 800,
                      }}
                    >
                      {option[0]}
                    </Box>
                    <strong>{option}</strong>
                    {active && (
                      <CheckRounded
                        sx={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.5rem",
                          width: "1.25rem",
                          height: "1.25rem",
                          borderRadius: 999,
                          color: "var(--primary-foreground)",
                          bgcolor: "var(--primary)",
                          fontSize: "0.75rem",
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ display: "grid", gap: "2rem", justifyItems: "center" }}>
              <Box
                sx={{
                  display: "grid",
                  width: "8rem",
                  height: "8rem",
                  placeItems: "center",
                  borderRadius: "1rem",
                  bgcolor: "var(--accent)",
                  boxShadow:
                    "0 0 0 4px color-mix(in srgb, var(--primary) 10%, transparent)",
                  fontSize: "4rem",
                  opacity: avatar ? 1 : 0.5,
                }}
              >
                {avatar ?? DEFAULT_AVATAR}
              </Box>
              <Box
                sx={{
                  display: "grid",
                  width: "100%",
                  gridTemplateColumns: {
                    xs: "repeat(4, 1fr)",
                    md: "repeat(8, 1fr)",
                  },
                  gap: "0.75rem",
                }}
              >
                {AVATAR_OPTIONS.map((option) => {
                  const active = avatar === option;

                  return (
                    <Box
                      component="button"
                      key={option}
                      type="button"
                      onClick={() => setAvatar(option)}
                      sx={{
                        position: "relative",
                        display: "grid",
                        aspectRatio: "1",
                        placeItems: "center",
                        border: "2px solid",
                        borderColor: active
                          ? "var(--primary)"
                          : "var(--border)",
                        borderRadius: "0.75rem",
                        color: "var(--foreground)",
                        bgcolor: active
                          ? "color-mix(in oklch, var(--primary) 5%, var(--card))"
                          : "var(--card)",
                        boxShadow: active
                          ? "0 0 0 4px color-mix(in oklch, var(--primary) 15%, transparent)"
                          : "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        transition:
                          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                        "&:hover": { boxShadow: "var(--shadow-card)" },
                      }}
                    >
                      {option}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>

        <Box
          component="footer"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "2.5rem",
          }}
        >
          <Button
            disabled={step === 0}
            startIcon={<ArrowBackRounded />}
            variant="text"
            onClick={() => setStep(0)}
          >
            Back
          </Button>

          {step === 0 ? (
            <Button
              disabled={!role}
              size="large"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              onClick={() => setStep(1)}
            >
              Next
            </Button>
          ) : (
            <Button
              disabled={!avatar}
              size="large"
              variant="contained"
              endIcon={<CheckRounded />}
              onClick={submit}
            >
              Finish setup
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
