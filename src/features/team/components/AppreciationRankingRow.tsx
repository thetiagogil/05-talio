import { FavoriteBorderRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import type { TopKudosReceiver } from "@/features/team/lib/teamInsights";

type AppreciationRankingRowProps = {
  currentUserId?: string;
  index: number;
  receiver: TopKudosReceiver;
};

export const AppreciationRankingRow = ({
  currentUserId,
  index,
  receiver,
}: AppreciationRankingRowProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      border: "1px solid var(--border)",
      borderRadius: "0.625rem",
      p: "0.75rem",
      bgcolor: "var(--background)",
    }}
  >
    <Typography
      component="small"
      sx={{
        width: "1.25rem",
        color: "var(--muted-foreground)",
        fontFamily: "JetBrains Mono, ui-monospace, monospace",
      }}
    >
      {index + 1}
    </Typography>
    <AvatarBubble value={receiver.user.avatar} size={32} />
    <Box component="span" sx={{ display: "grid", flex: 1 }}>
      <strong>
        {receiver.user.name}
        {receiver.user.id === currentUserId && <em> (me)</em>}
      </strong>
      <Box component="small" sx={{ color: "var(--muted-foreground)" }}>
        {receiver.user.role}
      </Box>
    </Box>
    <Box
      component="b"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        borderRadius: 999,
        px: "0.75rem",
        py: "0.25rem",
        color: "var(--accent2)",
        bgcolor: "color-mix(in oklch, var(--accent2) 10%, transparent)",
      }}
    >
      <FavoriteBorderRounded fontSize="small" /> {receiver.count}
    </Box>
  </Box>
);
