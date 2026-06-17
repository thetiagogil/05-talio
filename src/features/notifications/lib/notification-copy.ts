import type { ActivityEvent } from "@/types/talents";

export const getNotificationBrief = (event: ActivityEvent) => {
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
};
