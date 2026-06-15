import {
  AccessTimeRounded,
  EmojiEventsRounded,
  FavoriteBorderRounded,
  TrackChangesRounded,
} from "@mui/icons-material";
import { Box, Card } from "@mui/material";
import type { ReactNode } from "react";
import type { ProfileGlanceStats } from "@/features/personal/hooks/usePersonalProfileViewModel";
import { PanelEyebrow } from "./ProfileDomainBreakdown";

type ProfileAtGlanceProps = {
  stats: ProfileGlanceStats;
};

export function ProfileAtGlance({ stats }: ProfileAtGlanceProps) {
  return (
    <Card sx={{ p: "1.5rem", boxShadow: "none" }}>
      <PanelEyebrow>At a glance</PanelEyebrow>
      <Box sx={{ display: "grid", gap: "0.75rem", mt: "1rem" }}>
        <AtGlanceRow
          icon={<TrackChangesRounded />}
          label="To do tasks"
          value={stats.todoGoals}
        />
        <AtGlanceRow
          icon={<AccessTimeRounded />}
          label="In progress tasks"
          value={stats.activeGoals}
        />
        <AtGlanceRow
          icon={<EmojiEventsRounded />}
          label="Completed tasks"
          value={stats.completedGoals}
        />
        <AtGlanceRow
          icon={<FavoriteBorderRounded />}
          label="Kudos received"
          value={stats.kudosReceived}
        />
      </Box>
    </Card>
  );
}

function AtGlanceRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        fontSize: "0.875rem",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          minWidth: 0,
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--muted-foreground)",
        }}
      >
        {icon}
        {label}
      </Box>
      <Box
        component="strong"
        sx={{ fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
      >
        {value}
      </Box>
    </Box>
  );
}
