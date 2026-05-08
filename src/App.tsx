import { ConfigProvider, theme as antdTheme } from "antd"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ActivityPage } from "./features/activity/ActivityPage"
import { IndexRedirect } from "./features/auth/IndexRedirect"
import { LoginPage } from "./features/auth/LoginPage"
import { SetupPage } from "./features/auth/SetupPage"
import { LearnPage } from "./features/learn/LearnPage"
import { PersonalPage } from "./features/personal/PersonalPage"
import { TeamPage } from "./features/team/TeamPage"
import { useAppTheme, useEnsureSeed } from "./lib/talentsStore"

export default function App() {
  useEnsureSeed()

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
