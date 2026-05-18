import { useMemo, type ReactNode } from "react";
import {
  CheckCircleRounded,
  EmojiEventsRounded,
  FavoriteBorderRounded,
  MenuBookRounded,
  PersonAddAltRounded,
  StarBorderRounded,
  TrackChangesRounded,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { timeAgo } from "@/shared/utils/format";
import { domainStyle } from "@/shared/utils/style-utils";
import { useActivity } from "@/features/activity/hooks/useActivity";
import { useGoals } from "@/features/goals/hooks/useGoals";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { ActivityEvent } from "@/types/talents";

type ActivityFeedProps = {
  filter?: (event: ActivityEvent) => boolean;
  emptyText?: string;
};

export function ActivityFeed({
  filter,
  emptyText = "Nothing yet - activity will show up here.",
}: ActivityFeedProps) {
  const events = useActivity();

  const list = useMemo(() => {
    const filtered = filter ? events.filter(filter) : events;
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }, [events, filter]);

  if (list.length === 0) {
    return <EmptyState description={emptyText} />;
  }

  return (
    <Box
      component="ol"
      sx={{
        position: "relative",
        display: "grid",
        gap: "0.75rem",
        m: 0,
        p: 0,
        listStyle: "none",
        "&::before": {
          position: "absolute",
          top: "1rem",
          bottom: "1rem",
          left: "1.12rem",
          width: "1px",
          content: '""',
          bgcolor: "var(--border)",
        },
      }}
    >
      {list.map((event) => (
        <ActivityRow event={event} key={event.id} />
      ))}
    </Box>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const users = useUsers();
  const goals = useGoals();
  const talents = useTalents();
  const actor = users.find((user) => user.id === event.actorId);
  const target = event.targetId
    ? users.find((user) => user.id === event.targetId)
    : null;
  const goal = event.goalId
    ? goals.find((candidate) => candidate.id === event.goalId)
    : null;
  const talent = event.talentId
    ? talents.find((candidate) => candidate.id === event.talentId)
    : goal
      ? talents.find((candidate) => candidate.id === goal.talentId)
      : null;
  const icon = iconFor(event.type);
  const talentStyle = talent ? domainStyle(talent.category) : null;
  const isKudos = event.type === "kudos_sent";
  const messageAccent = talentStyle?.base ?? "var(--primary)";
  const messageBg = talentStyle?.soft ?? "var(--accent)";

  return (
    <Box
      component="li"
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
      }}
    >
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
      <Box
        sx={{
          flex: 1,
          border: "1px solid var(--border)",
          borderRadius: "0.875rem",
          p: "1rem",
          bgcolor: "var(--card)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
            <strong>{actor?.name ?? "Someone"}</strong>{" "}
            {phrase(event, target?.name, talent?.label)}
          </Typography>
          <Typography
            component="time"
            sx={{
              flex: "none",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
            }}
          >
            {timeAgo(event.createdAt)}
          </Typography>
        </Box>
        {isKudos && event.message && (
          <Box
            component="blockquote"
            sx={{
              mt: "0.75rem",
              mb: 0,
              mx: 0,
              border: `1px solid color-mix(in srgb, ${messageAccent} 18%, var(--border))`,
              borderRadius: "0.75rem",
              p: "0.75rem 0.85rem",
              color: "color-mix(in srgb, var(--foreground) 88%, transparent)",
              bgcolor: `color-mix(in srgb, ${messageBg} 70%, var(--surface))`,
              fontSize: "0.875rem",
              fontStyle: "italic",
              "&::before": {
                content: '"“"',
                color: messageAccent,
                fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                fontSize: "1.25rem",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: 0,
              },
            }}
          >
            <span>{event.message}</span>
          </Box>
        )}
        {goal && !isKudos && (
          <Typography
            component="span"
            sx={{
              display: "block",
              mt: "0.5rem",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
            }}
          >
            {goal.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function iconFor(type: ActivityEvent["type"]): {
  node: ReactNode;
  color: string;
  bg: string;
  border: string;
} {
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

function phrase(
  event: ActivityEvent,
  targetName?: string,
  talentName?: string,
) {
  switch (event.type) {
    case "kudos_sent":
      return (
        <>
          sent kudos to <strong>{targetName}</strong>
          {talentName && (
            <>
              {" "}
              for{" "}
              <Box component="em" sx={{ fontStyle: "italic" }}>
                {talentName}
              </Box>
            </>
          )}
        </>
      );
    case "goal_created":
      return (
        <>
          set a new goal
          {talentName && (
            <>
              {" "}
              linked to{" "}
              <Box component="em" sx={{ fontStyle: "italic" }}>
                {talentName}
              </Box>
            </>
          )}
        </>
      );
    case "goal_progressed":
      return (
        <>
          moved a goal to <strong>{event.message}</strong>
        </>
      );
    case "goal_completed":
      return (
        <>
          completed a goal
          {talentName && (
            <>
              {" "}
              for{" "}
              <Box component="em" sx={{ fontStyle: "italic" }}>
                {talentName}
              </Box>
            </>
          )}
        </>
      );
    case "goal_approved":
      return (
        <>
          approved <strong>{targetName}</strong>'s goal
        </>
      );
    case "manual_updated":
      return <>updated their Manual of Me</>;
    case "joined":
      return <>joined the team</>;
  }
}
