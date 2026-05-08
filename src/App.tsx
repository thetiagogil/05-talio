import { ConfigProvider, theme as antdTheme } from "antd"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ActivityPage } from "./pages/ActivityPage"
import { IndexRedirect } from "./pages/IndexRedirect"
import { LoginPage } from "./pages/LoginPage"
import { SetupPage } from "./pages/SetupPage"
import { LearnPage } from "./pages/LearnPage"
import { PersonalPage } from "./pages/PersonalPage"
import { TeamPage } from "./pages/TeamPage"
import { useEnsureWorkspaceSeed } from "./services/testDataService"
import { useAppTheme } from "./services/workspaceService"

export default function App() {
  useEnsureWorkspaceSeed()

  const appTheme = useAppTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm:
          appTheme === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#6f2dbd",
          borderRadius: 14,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
          Button: {
            controlHeightLG: 48,
            borderRadiusLG: 12,
          },
          Card: {
            borderRadiusLG: 24,
          },
          Input: {
            borderRadiusLG: 12,
          },
          Modal: {
            borderRadiusLG: 24,
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}
