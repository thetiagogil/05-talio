import { useMemo, useState } from "react";
import {
  CheckCircleRounded,
  CheckRounded,
  NotificationsNoneOutlined,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { approveGoal, useGoals } from "@/features/goals/hooks/useGoals";
import { useActivity } from "@/features/activity/hooks/useActivity";
import {
  markNotificationsRead,
  useNotificationsReadAt,
} from "@/features/notifications/hooks/useNotifications";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";
import { timeAgo } from "@/shared/utils/format";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import type { ActivityEvent } from "@/types/talents";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";

export function NotificationMenu() {
  const me = useCurrentUser();
  const events = useActivity();
  const goals = useGoals();
  const users = useUsers();
  const talents = useTalents();
  const readAt = useNotificationsReadAt();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const notifications = useMemo(() => {
    if (!me) return [];

    return events
      .filter(
        (event) =>
          (event.targetId === me.id && event.actorId !== me.id) ||
          (event.type === "joined" && event.actorId !== me.id),
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 30);
  }, [events, me]);

  const approvalRequests = useMemo(() => {
    if (!me) return [];

    return goals.filter(
      (goal) =>
        goal.progress === "Done" &&
        !goal.approved &&
        (goal.approvalRequests ?? []).includes(me.id),
    );
  }, [goals, me]);

  if (!me) return null;

  const unread =
    notifications.filter((event) => event.createdAt > readAt).length +
    approvalRequests.length;

  return (
    <>
      <Badge
        badgeContent={unread}
        color="primary"
        invisible={unread === 0}
        overlap="circular"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          "& .MuiBadge-badge": {
            top: "0.35rem",
            right: "0.35rem",
            minWidth: "1rem",
            height: "1rem",
            px: "0.25rem",
            border: "2px solid var(--surface)",
            borderRadius: 999,
            bgcolor: "var(--primary)",
            color: "var(--primary-foreground)",
            fontSize: "0.625rem",
            fontWeight: 800,
            lineHeight: 1,
            transform: "scale(1) translate(35%, -35%)",
            transformOrigin: "100% 0%",
          },
        }}
      >
        <IconButton
          aria-label="Notifications"
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            markNotificationsRead();
          }}
          sx={{
            color: "var(--foreground)",
            "&:hover": { color: "var(--primary)", bgcolor: "transparent" },
          }}
        >
          <NotificationsNoneOutlined />
        </IconButton>
      </Badge>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ width: "min(24rem, calc(100vw - 2rem))" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border)",
              px: "1rem",
              py: "0.75rem",
            }}
          >
            <Typography
              component="h3"
              sx={{ fontSize: "1rem", fontWeight: 800 }}
            >
              Notifications
            </Typography>
            <Button
              size="small"
              startIcon={<CheckRounded />}
              variant="text"
              onClick={markNotificationsRead}
            >
              Mark read
            </Button>
          </Box>
          <Box sx={{ maxHeight: "26rem", overflowY: "auto", p: "0.5rem" }}>
            {approvalRequests.length === 0 && notifications.length === 0 && (
              <Typography
                sx={{
                  p: "1.5rem",
                  color: "var(--muted-foreground)",
                  textAlign: "center",
                }}
              >
                You're all caught up.
              </Typography>
            )}

            {approvalRequests.map((goal) => {
              const owner = users.find((user) => user.id === goal.userId);
              const talent = talents.find(
                (candidate) => candidate.id === goal.talentId,
              );

              return (
                <Box
                  key={`request-${goal.id}`}
                  sx={{
                    display: "grid",
                    gap: "0.5rem",
                    m: "0.25rem",
                    borderRadius: "0.75rem",
                    p: "0.75rem",
                    bgcolor:
                      "color-mix(in oklch, var(--accent2) 10%, transparent)",
                    boxShadow:
                      "0 0 0 1px color-mix(in oklch, var(--accent2) 20%, transparent)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.45 }}>
                    <strong>{owner?.name}</strong> asked you to approve a goal
                    {talent && (
                      <>
                        {" "}
                        for{" "}
                        <Box component="em" sx={{ fontStyle: "italic" }}>
                          {talent.label}
                        </Box>
                      </>
                    )}
                    .
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      color: "var(--muted-foreground)",
                      fontSize: "0.75rem",
                    }}
                  >
                    "{goal.description}"
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<CheckCircleRounded />}
                    variant="contained"
                    onClick={() => approveGoal(goal.id, me.id)}
                  >
                    Approve goal
                  </Button>
                </Box>
              );
            })}

            {notifications.map((event) => (
              <NotificationRow key={event.id} event={event} />
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
}

function NotificationRow({ event }: { event: ActivityEvent }) {
  const users = useUsers();
  const actor = users.find((user) => user.id === event.actorId);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        borderRadius: "0.75rem",
        p: "0.75rem",
        "&:hover": {
          bgcolor: "color-mix(in oklch, var(--muted) 40%, transparent)",
        },
      }}
    >
      <AvatarBubble value={actor?.avatar} size={32} />
      <Box sx={{ display: "grid", minWidth: 0, gap: "0.12rem" }}>
        <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.45 }}>
          <strong>{actor?.name}</strong> {notificationBrief(event)}
        </Typography>
        {event.type === "kudos_sent" && event.message && (
          <Typography
            component="span"
            sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
          >
            "{event.message}"
          </Typography>
        )}
        <Typography
          component="time"
          sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
        >
          {timeAgo(event.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}

function notificationBrief(event: ActivityEvent) {
  switch (event.type) {
    case "kudos_sent":
      return "sent you kudos";
    case "goal_approved":
      return "approved your goal";
    case "joined":
      return "joined the team";
    default:
      return "shared an update";
  }
}
