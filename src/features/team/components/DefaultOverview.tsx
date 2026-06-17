import { Box } from "@mui/material";
import { useMemo } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { TeamDomainStatsSection } from "@/features/team/components/TeamDomainStatsSection";
import { TeamTopTalentsSection } from "@/features/team/components/TeamTopTalentsSection";
import {
  getTeamDomainStats,
  getTeamTopTalents,
} from "@/features/team/lib/teamInsights";
import { useUsers } from "@/features/users/hooks/useUsers";

export const DefaultOverview = () => {
  const users = useUsers();
  const talents = useTalents();
  const currentUser = useCurrentUser();

  const domainStats = useMemo(
    () => getTeamDomainStats(users, talents),
    [talents, users],
  );

  const topTalents = useMemo(
    () => getTeamTopTalents(users, talents),
    [talents, users],
  );

  return (
    <Box sx={{ display: "grid", gap: "2rem" }}>
      <TeamDomainStatsSection stats={domainStats} />
      <TeamTopTalentsSection
        currentUserId={currentUser?.id}
        topTalents={topTalents}
        users={users}
      />
    </Box>
  );
};
