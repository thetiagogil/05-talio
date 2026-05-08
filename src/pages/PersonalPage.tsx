import { Navigate, useNavigate, useParams } from "react-router-dom"
import { GoalsBoard } from "../components/features/personal/GoalsBoard"
import { KudosTab } from "../components/features/personal/KudosTab"
import { ManualEditor } from "../components/features/personal/ManualEditor"
import { ProfileTab } from "../components/features/personal/ProfileTab"
import { AppShell } from "../components/layout/AppShell"
import { PageHeader } from "../components/layout/PageHeader"

type PersonalTab = "profile" | "manual" | "goals" | "kudos"

const personalTabs: { id: PersonalTab; label: string }[] = [
  { id: "profile", label: "My profile" },
  { id: "manual", label: "Manual of me" },
  { id: "goals", label: "Goals" },
  { id: "kudos", label: "Kudos" },
]

const isPersonalTab = (tab: string | undefined): tab is PersonalTab =>
  personalTabs.some((item) => item.id === tab)

export function PersonalPage() {
  const { tab } = useParams()
  const navigate = useNavigate()

  if (!isPersonalTab(tab)) {
    return <Navigate replace to="/personal/profile" />
  }

  return (
    <AppShell>
      <PageHeader
        title="Personal"
        description="Your strengths, how you work, and where you're growing."
        tabs={personalTabs}
        activeTab={tab}
        onTabChange={(nextTab) => navigate(`/personal/${nextTab}`)}
      />

      <div className="page-content">
        {tab === "profile" && <ProfileTab />}
        {tab === "manual" && (
          <div className="narrow-content">
            <ManualEditor />
          </div>
        )}
        {tab === "goals" && (
          <div className="wide-content">
            <GoalsBoard />
          </div>
        )}
        {tab === "kudos" && <KudosTab />}
      </div>
    </AppShell>
  )
}
