import {
  continueWithTestUser,
  loginByEmail,
  useCurrentUser,
} from "@/features/auth/hooks/useAuth";
import { getPostLoginRoute } from "@/features/auth/lib/auth-routing";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginBrandPanel } from "@/features/auth/components/LoginBrandPanel";
import { LoginFormPanel } from "@/features/auth/components/LoginFormPanel";

export const LoginScreen = () => {
  const user = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(getPostLoginRoute(user), { replace: true });
  }, [navigate, user]);

  const handleEmailLogin = (nextEmail: string) => {
    const nextUser = loginByEmail(nextEmail);

    if (!nextUser) {
      return "We couldn't find that email. Try the demo account below.";
    }

    navigate(getPostLoginRoute(nextUser), { replace: true });
    return null;
  };

  const handleTestLogin = () => {
    const nextUser = continueWithTestUser();
    navigate(getPostLoginRoute(nextUser), { replace: true });
  };

  return (
    <Box
      component="main"
      sx={{
        display: "grid",
        minHeight: "100vh",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
      }}
    >
      <LoginBrandPanel />
      <LoginFormPanel
        onDemoLogin={handleTestLogin}
        onEmailLogin={handleEmailLogin}
      />
    </Box>
  );
};
