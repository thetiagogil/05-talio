import { StarBorderRounded } from "@mui/icons-material";
import { Box, Card } from "@mui/material";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ChemistryPanelHeading } from "@/features/team/components/ChemistryPanelHeading";
import { PairingSuggestionCard } from "@/features/team/components/PairingSuggestionCard";
import type { TeamPairing } from "@/features/team/lib/teamInsights";

type PairingSuggestionsCardProps = {
  pairings: TeamPairing[];
};

export const PairingSuggestionsCard = ({
  pairings,
}: PairingSuggestionsCardProps) => (
  <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
    <ChemistryPanelHeading
      description="Complementary teammates worth working with."
      icon={<StarBorderRounded />}
    >
      Pairings to try
    </ChemistryPanelHeading>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: "0.5rem",
        mt: "1rem",
      }}
    >
      {pairings.length === 0 ? (
        <EmptyState description="No complementary pairings are available yet." />
      ) : (
        pairings.map((pairing) => (
          <PairingSuggestionCard
            key={`${pairing.first.id}-${pairing.second.id}`}
            pairing={pairing}
          />
        ))
      )}
    </Box>
  </Card>
);
