import { FavoriteBorderRounded } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import { AppreciationRankingRow } from "@/features/team/components/AppreciationRankingRow";
import { ChemistryPanelHeading } from "@/features/team/components/ChemistryPanelHeading";
import type { TopKudosReceiver } from "@/features/team/lib/teamInsights";

type AppreciationRankingCardProps = {
  currentUserId?: string;
  receivers: TopKudosReceiver[];
};

export const AppreciationRankingCard = ({
  currentUserId,
  receivers,
}: AppreciationRankingCardProps) => (
  <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
    <ChemistryPanelHeading
      description="Teammates who've received the most kudos."
      icon={<FavoriteBorderRounded />}
    >
      Most appreciated
    </ChemistryPanelHeading>
    <Box sx={{ display: "grid", gap: "0.5rem", mt: "1rem" }}>
      {receivers.length === 0 ? (
        <Typography component="span" sx={{ color: "var(--muted-foreground)" }}>
          No kudos sent yet.
        </Typography>
      ) : (
        receivers.map((receiver, index) => (
          <AppreciationRankingRow
            currentUserId={currentUserId}
            index={index}
            key={receiver.user.id}
            receiver={receiver}
          />
        ))
      )}
    </Box>
  </Card>
);
