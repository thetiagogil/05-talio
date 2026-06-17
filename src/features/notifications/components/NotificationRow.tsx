import { Box, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { getNotificationBrief } from "@/features/notifications/lib/notification-copy";
import { timeAgo } from "@/shared/utils/format";
import type { ActivityEvent, User } from "@/types/talents";

type NotificationRowProps = {
  actor?: User;
  event: ActivityEvent;
};

export const NotificationRow = ({ actor, event }: NotificationRowProps) => (
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
        <strong>{actor?.name}</strong> {getNotificationBrief(event)}
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
