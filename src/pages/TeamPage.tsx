import { Navigate, useNavigate, useParams } from "react-router-dom";
import { TeamChemistry } from "../components/features/team/TeamChemistry";
import { TeamOverview } from "../components/features/team/TeamOverview";
import { AppShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";

type TeamTab = "overview" | "compare" | "chemistry";

const teamTabs: { id: TeamTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "compare", label: "Compare" },
  { id: "chemistry", label: "Team chemistry" },
];

const isTeamTab = (tab: string | undefined): tab is TeamTab =>
  teamTabs.some((item) => item.id === tab);

export function TeamPage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  if (!isTeamTab(tab)) {
    return <Navigate replace to="/team/overview" />;
  }

  return (
    <AppShell>
      <PageHeader
        title="Team"
        description="Search teammates, explore profiles, or compare strengths side-by-side."
        tabs={teamTabs}
        activeTab={tab}
        onTabChange={(nextTab) => navigate(`/team/${nextTab}`)}
      />

      <div className="page-content">
        {tab === "chemistry" ? (
          <TeamChemistry />
        ) : (
          <TeamOverview mode={tab === "compare" ? "compare" : "overview"} />
        )}
      </div>
    </AppShell>
  );
}
