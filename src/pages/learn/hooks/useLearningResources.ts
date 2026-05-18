import { useMemo, useState } from "react";
import { LEARNING_RESOURCES } from "@/features/learning/data/resources";
import { DOMAINS } from "@/features/talents/constants";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import type { Domain } from "@/types/talents";

export type LearningFilter = Domain | "All" | "For me";

export const learningFilterOptions = ["For me", "All", ...DOMAINS] as const;

export function useLearningResources() {
  const currentUser = useCurrentUser();
  const talents = useTalents();
  const [filter, setFilter] = useState<LearningFilter>("For me");

  const myTalentLabels = useMemo(() => {
    if (!currentUser) return new Set<string>();

    return new Set(
      currentUser.talents
        .map((id) => talents.find((talent) => talent.id === id)?.label)
        .filter((label): label is string => Boolean(label)),
    );
  }, [currentUser, talents]);

  const resources = useMemo(() => {
    if (filter === "All") return LEARNING_RESOURCES;
    if (filter === "For me") {
      return [...LEARNING_RESOURCES].sort((a, b) => {
        const aMatch = a.tags.filter((tag) => myTalentLabels.has(tag)).length;
        const bMatch = b.tags.filter((tag) => myTalentLabels.has(tag)).length;
        return bMatch - aMatch;
      });
    }

    return LEARNING_RESOURCES.filter((resource) => resource.domain === filter);
  }, [filter, myTalentLabels]);

  return {
    filter,
    filters: learningFilterOptions,
    matchedTalentLabels: myTalentLabels,
    resources,
    setFilter,
  };
}
