import { Box } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { TeamChemistry } from "@/features/team/components/TeamChemistry";
import { TeamOverview } from "@/features/team/components/TeamOverview";
import { AppShell } from "@/shared/components/layout/AppShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";

type TeamTab = "overview" | "compare" | "chemistry";

const teamTabs: { id: TeamTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "compare", label: "Compare" },
  { id: "chemistry", label: "Team chemistry" },
];

const isTeamTab = (tab: string | undefined): tab is TeamTab =>
  teamTabs.some((item) => item.id === tab);

export const TeamPage = () => {
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

      <Box sx={{ p: { xs: "2rem 1rem", md: "2rem" } }}>
        {tab === "chemistry" ? (
          <TeamChemistry />
        ) : (
          <TeamOverview mode={tab === "compare" ? "compare" : "overview"} />
        )}
      </Box>
    </AppShell>
  );
};
