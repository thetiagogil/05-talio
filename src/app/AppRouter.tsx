import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import {
  ActivityPage,
  LearnPage,
  LoginPage,
  PersonalPage,
  SetupPage,
  TeamPage,
} from "./lazy-pages";
import { RouteSuspense } from "./RouteSuspense";
import { ScrollToTop } from "./ScrollToTop";

export const AppRouter = () => {
  const user = useCurrentUser();
  const rootRoute = user
    ? user.role && user.avatar
      ? "/personal/profile"
      : "/setup"
    : "/login";

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteSuspense>
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
      </RouteSuspense>
    </BrowserRouter>
  );
};
