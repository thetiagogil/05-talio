import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { timeAgo } from "@/shared/utils/format";
import { domainStyle } from "@/shared/utils/style-utils";
import { useActivity } from "@/features/activity/hooks/useActivity";
import { useGoals } from "@/features/goals/hooks/useGoals";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { ActivityEvent } from "@/types/talents";
import { ActivityIcon } from "@/features/activity/components/ActivityIcon";
import { ActivityPhrase } from "@/features/activity/lib/activityPresentation";

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
      <ActivityIcon type={event.type} />
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
            <ActivityPhrase
              event={event}
              talentName={talent?.label}
              targetName={target?.name}
            />
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
                content: '"\\201C"',
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
