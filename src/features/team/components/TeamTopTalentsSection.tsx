import { Box } from "@mui/material";
import { useState } from "react";
import { TeamTopTalentAccordion } from "@/features/team/components/TeamTopTalentAccordion";
import { TeamSectionHeading } from "@/features/team/components/TeamSectionHeading";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import type { TeamTopTalent } from "@/features/team/lib/teamInsights";
import type { User } from "@/types/talents";

type TeamTopTalentsSectionProps = {
  currentUserId?: string;
  topTalents: TeamTopTalent[];
  users: User[];
};

export const TeamTopTalentsSection = ({
  currentUserId,
  topTalents,
  users,
}: TeamTopTalentsSectionProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  return (
    <Box component="section" sx={{ display: "grid", gap: "0.25rem" }}>
      <TeamSectionHeading description="Strengths that show up most across the team.">
        Team top talents
      </TeamSectionHeading>
      {topTalents.length === 0 ? (
        <Box sx={{ mt: "0.75rem" }}>
          <EmptyState description="No team talents are available yet." />
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: "0.75rem", mt: "0.75rem" }}>
          {topTalents.map((topTalent, index) => (
            <TeamTopTalentAccordion
              currentUserId={currentUserId}
              expanded={expanded}
              index={index}
              key={topTalent.talent.id}
              onExpandedChange={setExpanded}
              topTalent={topTalent}
              users={users}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
