import { Box } from "@mui/material";
import { LearnResources } from "./_components/LearnResources";
import { AppShell } from "@/shared/components/layout/AppShell";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export const LearnPage = () => {
  return (
    <AppShell>
      <PageHeader
        title="Learn"
        description="Learning paths that connect strengths to practical formats: reading, talks, podcasts, and exercises."
      />

      <Box sx={{ p: { xs: "2rem 1rem", md: "2rem" } }}>
        <LearnResources />
      </Box>
    </AppShell>
  );
};
