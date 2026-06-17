import { useMemo, useState } from "react";
import { CheckRounded, NotificationsNoneOutlined } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { useActivity } from "@/features/activity/hooks/useActivity";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useGoals } from "@/features/goals/hooks/useGoals";
import {
  markNotificationsRead,
  useNotificationsReadAt,
} from "@/features/notifications/hooks/useNotifications";
import { ApprovalRequestCard } from "@/features/notifications/components/ApprovalRequestCard";
import { NotificationRow } from "@/features/notifications/components/NotificationRow";
import {
  getApprovalRequests,
  getUnreadNotificationCount,
  getUserNotifications,
} from "@/features/notifications/lib/notification-selectors";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";

export const NotificationMenu = () => {
  const me = useCurrentUser();
  const events = useActivity();
  const goals = useGoals();
  const users = useUsers();
  const talents = useTalents();
  const readAt = useNotificationsReadAt();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const notifications = useMemo(() => {
    if (!me) return [];

    return getUserNotifications(events, me.id);
  }, [events, me]);

  const approvalRequests = useMemo(() => {
    if (!me) return [];

    return getApprovalRequests(goals, me.id);
  }, [goals, me]);

  if (!me) return null;

  const unread = getUnreadNotificationCount(
    notifications,
    approvalRequests.length,
    readAt,
  );

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
          aria-label={
            unread > 0 ? `${unread} unread notifications` : "Notifications"
          }
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            markNotificationsRead();
          }}
          sx={{
            width: "2.5rem",
            height: "2.5rem",
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
                <ApprovalRequestCard
                  approverId={me.id}
                  goal={goal}
                  key={`request-${goal.id}`}
                  owner={owner}
                  talent={talent}
                />
              );
            })}

            {notifications.map((event) => {
              const actor = users.find((user) => user.id === event.actorId);

              return (
                <NotificationRow actor={actor} event={event} key={event.id} />
              );
            })}
          </Box>
        </Box>
      </Popover>
    </>
  );
};
