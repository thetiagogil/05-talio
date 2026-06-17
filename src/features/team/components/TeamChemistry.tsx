import { useMemo } from "react";
import { Box } from "@mui/material";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useKudos } from "@/features/kudos/hooks/useKudos";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";
import { AppreciationRankingCard } from "@/features/team/components/AppreciationRankingCard";
import { ChemistryDomainHighlights } from "@/features/team/components/ChemistryDomainHighlights";
import { PairingSuggestionsCard } from "@/features/team/components/PairingSuggestionsCard";
import {
  getDomainTopThreeStats,
  getTeamPairings,
  getTopKudosReceivers,
} from "@/features/team/lib/teamInsights";

export const TeamChemistry = () => {
  const users = useUsers();
  const talents = useTalents();
  const kudos = useKudos();
  const currentUser = useCurrentUser();

  const domainTopThree = useMemo(
    () => getDomainTopThreeStats(users, talents),
    [talents, users],
  );

  const topReceivers = useMemo(
    () => getTopKudosReceivers(kudos, users),
    [kudos, users],
  );
  const pairings = useMemo(
    () => getTeamPairings(users, talents),
    [talents, users],
  );

  return (
    <Box
      sx={{
        display: "grid",
        width: "min(100%, 64rem)",
        mx: "auto",
        gap: "1.5rem",
      }}
    >
      <ChemistryDomainHighlights stats={domainTopThree} />
      <AppreciationRankingCard
        currentUserId={currentUser?.id}
        receivers={topReceivers}
      />
      <PairingSuggestionsCard pairings={pairings} />
    </Box>
  );
};
