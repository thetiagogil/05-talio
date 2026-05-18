import { useCallback, useMemo } from "react";
import { useActivity } from "@/features/activity/hooks/useActivity";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useKudos } from "@/features/kudos/hooks/useKudos";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { ActivityEvent } from "@/types/talents";
import type { ActivityTab } from "../ActivityPage";

const weekStart = Date.now() - 7 * 86400000;

export function useActivityPageModel(activeTab: ActivityTab) {
  const currentUser = useCurrentUser();
  const events = useActivity();
  const users = useUsers();
  const kudos = useKudos();

  const stats = useMemo(
    () => ({
      kudos: kudos.filter((item) => item.createdAt > weekStart).length,
      goalsCompleted: events.filter(
        (event) =>
          event.type === "goal_completed" && event.createdAt > weekStart,
      ).length,
      manuals: events.filter(
        (event) =>
          (event.type === "manual_updated" || event.type === "joined") &&
          event.createdAt > weekStart,
      ).length,
      active: new Set(
        events
          .filter((event) => event.createdAt > weekStart)
          .map((event) => event.actorId),
      ).size,
      userCount: users.length,
    }),
    [events, kudos, users.length],
  );

  const filterActivity = useCallback(
    (event: ActivityEvent) => {
      if (activeTab === "all") return true;
      if (activeTab === "mine" && currentUser) {
        return (
          event.actorId === currentUser.id || event.targetId === currentUser.id
        );
      }
      if (activeTab === "kudos") return event.type === "kudos_sent";
      if (activeTab === "goals") return event.type.startsWith("goal_");
      if (activeTab === "manuals") {
        return event.type === "manual_updated" || event.type === "joined";
      }

      return true;
    },
    [activeTab, currentUser],
  );

  return { filterActivity, stats };
}
