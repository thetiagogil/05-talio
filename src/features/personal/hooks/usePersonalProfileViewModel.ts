import { useMemo } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useGoals } from "@/features/goals/hooks/useGoals";
import { useKudos } from "@/features/kudos/hooks/useKudos";
import { DOMAINS } from "@/features/talents/constants";
import { useTalents } from "@/features/talents/hooks/useTalents";
import type { Domain, Goal, Talent, User } from "@/types/talents";

export type ProfileDomainBreakdownItem = {
  domain: Domain;
  count: number;
  percent: number;
};

export type ProfileGlanceStats = {
  todoGoals: number;
  activeGoals: number;
  completedGoals: number;
  kudosReceived: number;
};

export type PersonalProfileViewModel = {
  user: User;
  userTalents: Talent[];
  goals: Goal[];
  domainBreakdown: ProfileDomainBreakdownItem[];
  dominantDomain: Domain | null;
  leadingTalentLabel: string | null;
  stats: ProfileGlanceStats;
};

export function usePersonalProfileViewModel(): PersonalProfileViewModel | null {
  const user = useCurrentUser();
  const talents = useTalents();
  const goals = useGoals();
  const kudos = useKudos();

  const userTalents = useMemo(
    () =>
      (user?.talents ?? [])
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [talents, user?.talents],
  );

  const myGoals = useMemo(
    () => goals.filter((goal) => goal.userId === user?.id),
    [goals, user?.id],
  );

  const myKudos = useMemo(
    () => kudos.filter((item) => item.toId === user?.id),
    [kudos, user?.id],
  );

  const domainBreakdown = useMemo(
    () =>
      DOMAINS.map((domain) => {
        const count = userTalents.filter(
          (talent) => talent.category === domain,
        ).length;

        return {
          domain,
          count,
          percent: (count / Math.max(userTalents.length, 1)) * 100,
        };
      }),
    [userTalents],
  );

  const dominantDomainItem =
    domainBreakdown.reduce<ProfileDomainBreakdownItem | null>(
      (current, item) =>
        !current || item.count > current.count ? item : current,
      null,
    );
  const dominantDomain =
    dominantDomainItem && dominantDomainItem.count > 0
      ? dominantDomainItem.domain
      : null;

  if (!user) return null;

  return {
    user,
    userTalents,
    goals: myGoals,
    domainBreakdown,
    dominantDomain,
    leadingTalentLabel: userTalents[0]?.label ?? null,
    stats: {
      todoGoals: myGoals.filter((goal) => goal.progress === "To do").length,
      activeGoals: myGoals.filter((goal) => goal.progress === "Doing").length,
      completedGoals: myGoals.filter((goal) => goal.progress === "Done").length,
      kudosReceived: myKudos.length,
    },
  };
}
