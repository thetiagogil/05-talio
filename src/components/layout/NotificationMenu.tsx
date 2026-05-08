import { useMemo } from "react";
import { Badge, Button, Popover } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  approveGoal,
  markNotificationsRead,
  useActivity,
  useGoals,
  useNotificationsReadAt,
  useTalents,
  useUsers,
} from "../../services/workspaceService";
import { timeAgo } from "../../lib/utils/format";
import { useCurrentUser } from "../../services/authService";
import type { ActivityEvent } from "../../types/talents";
import { AvatarBubble } from "../common/AvatarBubble";

export function NotificationMenu() {
  const me = useCurrentUser();
  const events = useActivity();
  const goals = useGoals();
  const users = useUsers();
  const talents = useTalents();
  const readAt = useNotificationsReadAt();

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
    <Popover
      arrow={false}
      placement="bottomRight"
      trigger="click"
      overlayClassName="notification-popover"
      onOpenChange={(open) => {
        if (open) markNotificationsRead();
      }}
      content={
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={markNotificationsRead}
            >
              Mark read
            </Button>
          </div>
          <div className="notifications-list">
            {approvalRequests.length === 0 && notifications.length === 0 && (
              <p className="notifications-empty">You're all caught up.</p>
            )}

            {approvalRequests.map((goal) => {
              const owner = users.find((user) => user.id === goal.userId);
              const talent = talents.find(
                (candidate) => candidate.id === goal.talentId,
              );

              return (
                <div
                  key={`request-${goal.id}`}
                  className="notification-request"
                >
                  <p>
                    <strong>{owner?.name}</strong> asked you to approve a goal
                    {talent && (
                      <>
                        {" "}
                        for <em className="display-italic">{talent.label}</em>
                      </>
                    )}
                    .
                  </p>
                  <span>"{goal.description}"</span>
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => approveGoal(goal.id, me.id)}
                  >
                    Approve goal
                  </Button>
                </div>
              );
            })}

            {notifications.map((event) => (
              <NotificationRow key={event.id} event={event} />
            ))}
          </div>
        </div>
      }
    >
      <Badge count={unread} size="small" offset={[-2, 4]}>
        <Button
          aria-label="Notifications"
          className="topbar-icon-button"
          shape="circle"
          type="text"
          icon={<BellOutlined />}
        />
      </Badge>
    </Popover>
  );
}

function NotificationRow({ event }: { event: ActivityEvent }) {
  const users = useUsers();
  const actor = users.find((user) => user.id === event.actorId);

  return (
    <div className="notification-row">
      <AvatarBubble value={actor?.avatar} size={32} />
      <div>
        <p>
          <strong>{actor?.name}</strong> {notificationBrief(event)}
        </p>
        {event.type === "kudos_sent" && event.message && (
          <span>"{event.message}"</span>
        )}
        <time>{timeAgo(event.createdAt)}</time>
      </div>
    </div>
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
