import { Box } from "@mui/material";
import { ChemistryDomainCard } from "@/features/team/components/ChemistryDomainCard";
import type { DomainTopThreeStat } from "@/features/team/lib/teamInsights";

type ChemistryDomainHighlightsProps = {
  stats: DomainTopThreeStat[];
};

export const ChemistryDomainHighlights = ({
  stats,
}: ChemistryDomainHighlightsProps) => {
  const weakest = stats[0];
  const strongest = stats[stats.length - 1];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: "1rem",
      }}
    >
      <ChemistryDomainCard
        eyebrow="Team superpower"
        title={strongest.domain}
        text={`${strongest.count} top-3 talents land here. This is where your team naturally shines.`}
      />
      <ChemistryDomainCard
        eyebrow="Watch the gap"
        title={weakest.domain}
        text={`Only ${weakest.count} top-3 talents here. Worth pairing intentionally on these efforts.`}
      />
    </Box>
  );
};
