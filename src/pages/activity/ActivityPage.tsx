import { Box } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ActivityDashboard } from "./_components/ActivityDashboard";
import { AppShell } from "@/shared/components/layout/AppShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export type ActivityTab = "all" | "kudos" | "goals" | "manuals" | "mine";

const activityTabs: { id: ActivityTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kudos", label: "Kudos" },
  { id: "goals", label: "Goals" },
  { id: "manuals", label: "Manuals" },
  { id: "mine", label: "Mine" },
];

const isActivityTab = (tab: string | undefined): tab is ActivityTab =>
  activityTabs.some((item) => item.id === tab);

export const ActivityPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  if (!isActivityTab(tab)) {
    return <Navigate replace to="/activity/all" />;
  }

  return (
    <AppShell>
      <PageHeader
        title="Activity"
        description="A living feed of what your team is working on, sharing, and celebrating."
        tabs={activityTabs}
        activeTab={tab}
        onTabChange={(nextTab) => navigate(`/activity/${nextTab}`)}
      />

      <Box sx={{ p: { xs: "2rem 1rem", md: "2rem" } }}>
        <ActivityDashboard activeTab={tab} />
      </Box>
    </AppShell>
  );
};
