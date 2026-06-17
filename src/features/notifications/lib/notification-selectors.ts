import type { ActivityEvent, Goal } from "@/types/talents";

export const getUserNotifications = (events: ActivityEvent[], userId: string) =>
  events
    .filter(
      (event) =>
        (event.targetId === userId && event.actorId !== userId) ||
        (event.type === "joined" && event.actorId !== userId),
    )
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 30);

export const getApprovalRequests = (goals: Goal[], userId: string) =>
  goals.filter(
    (goal) =>
      goal.progress === "Done" &&
      !goal.approved &&
      (goal.approvalRequests ?? []).includes(userId),
  );

export const getUnreadNotificationCount = (
  notifications: ActivityEvent[],
  approvalRequestCount: number,
  readAt: number,
) =>
  notifications.filter((event) => event.createdAt > readAt).length +
  approvalRequestCount;
