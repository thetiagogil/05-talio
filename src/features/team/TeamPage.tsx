import { useState } from "react"
import { AppShell } from "../../components/layout/AppShell"
import { PageHeader } from "../../components/layout/PageHeader"
import { TeamChemistry } from "./TeamChemistry"
import { TeamOverview } from "./TeamOverview"

type TeamTab = "overview" | "chemistry"

export function TeamPage() {
  const [tab, setTab] = useState<TeamTab>("overview")

  return (
    <AppShell>
      <PageHeader
        eyebrow="Together"
        title="Team"
        description="Search teammates, explore profiles, or compare strengths side-by-side."
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "chemistry", label: "Team chemistry" },
        ]}
        activeTab={tab}
        onTabChange={(nextTab) => setTab(nextTab as TeamTab)}
      />

      <div className="page-content">
        {tab === "overview" ? <TeamOverview /> : <TeamChemistry />}
      </div>
    </AppShell>
  )
}
