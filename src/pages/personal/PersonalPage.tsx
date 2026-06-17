import { Box } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { GoalsBoard } from "@/features/goals/components/GoalsBoard";
import { KudosTab } from "@/features/kudos/components/KudosTab";
import { ManualEditor } from "@/features/personal/components/ManualEditor";
import { ProfileTab } from "@/features/personal/components/ProfileTab";
import { AppShell } from "@/shared/components/layout/AppShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";

type PersonalTab = "profile" | "manual" | "goals" | "kudos";

const personalTabs: { id: PersonalTab; label: string }[] = [
  { id: "profile", label: "My profile" },
  { id: "manual", label: "Manual of me" },
  { id: "goals", label: "Goals" },
  { id: "kudos", label: "Kudos" },
];

const isPersonalTab = (tab: string | undefined): tab is PersonalTab =>
  personalTabs.some((item) => item.id === tab);

export const PersonalPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  if (!isPersonalTab(tab)) {
    return <Navigate replace to="/personal/profile" />;
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

      <Box sx={{ p: { xs: "2rem 1rem", md: "2rem" } }}>
        {tab === "profile" && <ProfileTab />}
        {tab === "manual" && (
          <Box sx={{ width: "min(100%, 48rem)", mx: "auto" }}>
            <ManualEditor />
          </Box>
        )}
        {tab === "goals" && (
          <Box sx={{ width: "min(100%, 72rem)", mx: "auto" }}>
            <GoalsBoard />
          </Box>
        )}
        {tab === "kudos" && <KudosTab />}
      </Box>
    </AppShell>
  );
};
