import { ConfigProvider, theme as antdTheme } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ActivityPage } from "./pages/ActivityPage";
import { IndexRedirect } from "./pages/IndexRedirect";
import { LoginPage } from "./pages/LoginPage";
import { SetupPage } from "./pages/SetupPage";
import { LearnPage } from "./pages/LearnPage";
import { PersonalPage } from "./pages/PersonalPage";
import { TeamPage } from "./pages/TeamPage";
import { useEnsureWorkspaceSeed } from "./services/testDataService";
import { useAppTheme } from "./services/workspaceService";

export default function App() {
  useEnsureWorkspaceSeed();

  const appTheme = useAppTheme();
  const darkMode = appTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorBgBase: darkMode ? "#181326" : "#fbfafc",
          colorBgContainer: darkMode ? "#211a31" : "#ffffff",
          colorBorder: darkMode ? "rgb(255 255 255 / 12%)" : "#e6e1eb",
          colorPrimary: darkMode ? "#c69af1" : "#6f2dbd",
          colorTextBase: darkMode ? "#f8f5fb" : "#181326",
          borderRadius: 10,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
          Button: {
            controlHeightLG: 48,
            borderRadiusLG: 10,
          },
          Card: {
            borderRadiusLG: 12,
          },
          Input: {
            borderRadiusLG: 10,
          },
          Modal: {
            borderRadiusLG: 12,
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexRedirect />} />
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
    </ConfigProvider>
  );
}
