import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { SetupAvatarStep } from "@/features/users/components/SetupAvatarStep";
import { SetupFlowFooter } from "@/features/users/components/SetupFlowFooter";
import { SetupRoleStep } from "@/features/users/components/SetupRoleStep";
import { SetupStepHeader } from "@/features/users/components/SetupStepHeader";
import { updateUser } from "@/features/users/hooks/useUsers";
import type { RoleName } from "@/types/talents";

export const SetupFlow = () => {
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
  const canContinue = Boolean(role);
  const canSubmit = Boolean(role && avatar);

  const submit = () => {
    if (!role || !avatar) return;

    updateUser(currentUser.id, { role, avatar });
    navigate("/personal/profile", { replace: true });
  };

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

        <SetupStepHeader step={step} />

        <Box component="section" sx={{ flex: 1 }}>
          {step === 0 ? (
            <SetupRoleStep role={role} onRoleChange={setRole} />
          ) : (
            <SetupAvatarStep avatar={avatar} onAvatarChange={setAvatar} />
          )}
        </Box>

        <SetupFlowFooter
          canContinue={canContinue}
          canSubmit={canSubmit}
          step={step}
          onBack={() => setStep(0)}
          onNext={() => setStep(1)}
          onSubmit={submit}
        />
      </Box>
    </Box>
  );
};
