import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ActivityPage } from "./pages/ActivityPage";
import { LoginPage } from "./pages/LoginPage";
import { SetupPage } from "./pages/SetupPage";
import { LearnPage } from "./pages/LearnPage";
import { PersonalPage } from "./pages/PersonalPage";
import { TeamPage } from "./pages/TeamPage";
import { createTalioTheme } from "./lib/theme/muiTheme";
import { useCurrentUser } from "./services/authService";
import { useAppTheme } from "./services/workspaceService";

export default function App() {
  const appTheme = useAppTheme();
  const user = useCurrentUser();
  const theme = useMemo(() => createTalioTheme(appTheme), [appTheme]);
  const rootRoute = user
    ? user.role && user.avatar
      ? "/personal/profile"
      : "/setup"
    : "/login";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to={rootRoute} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route
            path="/personal"
            element={<Navigate replace to="/personal/profile" />}
          />
          <Route path="/personal/:tab" element={<PersonalPage />} />
          <Route
            path="/team"
            element={<Navigate replace to="/team/overview" />}
          />
          <Route path="/team/:tab" element={<TeamPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route
            path="/activity"
            element={<Navigate replace to="/activity/all" />}
          />
          <Route path="/activity/:tab" element={<ActivityPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
