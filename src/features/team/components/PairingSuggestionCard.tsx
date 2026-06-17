import { Box, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import type { TeamPairing } from "@/features/team/lib/teamInsights";

type PairingSuggestionCardProps = {
  pairing: TeamPairing;
};

export const PairingSuggestionCard = ({
  pairing,
}: PairingSuggestionCardProps) => (
  <Box
    sx={{
      border: "1px solid var(--border)",
      borderRadius: "0.875rem",
      p: "1rem",
      bgcolor: "var(--background)",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <AvatarBubble value={pairing.first.avatar} size={32} />
      <span>+</span>
      <AvatarBubble value={pairing.second.avatar} size={32} />
    </Box>
    <Typography component="strong" sx={{ display: "block", mt: "0.75rem" }}>
      {pairing.first.name} &amp; {pairing.second.name}
    </Typography>
    <Typography
      sx={{
        mt: "0.35rem",
        color: "var(--muted-foreground)",
        fontSize: "0.75rem",
        lineHeight: 1.55,
      }}
    >
      {pairing.reason}
    </Typography>
  </Box>
);
