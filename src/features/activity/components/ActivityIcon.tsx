import type { ReactNode } from "react";
import {
  CheckCircleRounded,
  EmojiEventsRounded,
  FavoriteBorderRounded,
  MenuBookRounded,
  PersonAddAltRounded,
  StarBorderRounded,
  TrackChangesRounded,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import type { ActivityEvent } from "@/types/talents";

type ActivityIconProps = {
  type: ActivityEvent["type"];
};

type ActivityIconStyle = {
  node: ReactNode;
  color: string;
  bg: string;
  border: string;
};

export const ActivityIcon = ({ type }: ActivityIconProps) => {
  const icon = iconForActivityType(type);

  return (
    <Box
      component="span"
      sx={{
        zIndex: 1,
        display: "grid",
        width: "2.25rem",
        height: "2.25rem",
        flex: "none",
        placeItems: "center",
        border: "1px solid",
        borderColor: icon.border,
        borderRadius: 999,
        color: icon.color,
        bgcolor: icon.bg,
      }}
    >
      {icon.node}
    </Box>
  );
};

function iconForActivityType(type: ActivityEvent["type"]): ActivityIconStyle {
  switch (type) {
    case "kudos_sent":
      return {
        node: <FavoriteBorderRounded />,
        color: "var(--accent2)",
        border: "color-mix(in oklch, var(--accent2) 30%, transparent)",
        bg: "color-mix(in oklch, var(--accent2) 10%, var(--background))",
      };
    case "goal_created":
      return {
        node: <TrackChangesRounded />,
        color: "var(--foreground)",
        border: "var(--border)",
        bg: "var(--background)",
      };
    case "goal_progressed":
      return {
        node: <StarBorderRounded />,
        color: "var(--progress-doing)",
        border: "color-mix(in oklch, var(--progress-doing) 30%, transparent)",
        bg: "var(--progress-doing-soft)",
      };
    case "goal_completed":
      return {
        node: <EmojiEventsRounded />,
        color: "var(--progress-done)",
        border: "color-mix(in oklch, var(--progress-done) 30%, transparent)",
        bg: "var(--progress-done-soft)",
      };
    case "goal_approved":
      return {
        node: <CheckCircleRounded />,
        color: "var(--progress-done)",
        border: "color-mix(in oklch, var(--progress-done) 30%, transparent)",
        bg: "var(--progress-done-soft)",
      };
    case "manual_updated":
      return {
        node: <MenuBookRounded />,
        color: "var(--foreground)",
        border: "var(--border)",
        bg: "var(--background)",
      };
    case "joined":
      return {
        node: <PersonAddAltRounded />,
        color: "var(--accent2)",
        border: "color-mix(in oklch, var(--accent2) 30%, transparent)",
        bg: "color-mix(in oklch, var(--accent2) 10%, var(--background))",
      };
  }
}
