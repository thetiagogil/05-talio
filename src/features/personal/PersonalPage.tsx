import { useState } from "react"
import { AppShell } from "../../components/layout/AppShell"
import { PageHeader } from "../../components/layout/PageHeader"
import { useCurrentUser } from "../../lib/talentsStore"
import { GoalsBoard } from "./GoalsBoard"
import { KudosTab } from "./KudosTab"
import { ManualEditor } from "./ManualEditor"
import { ProfileTab } from "./ProfileTab"

type PersonalTab = "profile" | "manual" | "goals" | "kudos"

export function PersonalPage() {
  const [tab, setTab] = useState<PersonalTab>("profile")
  const user = useCurrentUser()

  return (
    <AppShell>
      <PageHeader
        eyebrow={user ? `Hi, ${user.name.split(" ")[0]}` : undefined}
        title="Personal"
        description="Your strengths, how you work, and where you're growing."
        tabs={[
          { id: "profile", label: "My profile" },
          { id: "manual", label: "Manual of me" },
          { id: "goals", label: "Personal goals" },
          { id: "kudos", label: "Kudos received" },
        ]}
        activeTab={tab}
        onTabChange={(nextTab) => setTab(nextTab as PersonalTab)}
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
