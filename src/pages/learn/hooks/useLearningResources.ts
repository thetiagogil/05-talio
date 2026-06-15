import { useMemo, useState } from "react";
import { LEARNING_RESOURCES } from "@/features/learning/data/resources";
import { DOMAINS } from "@/features/talents/constants";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import type { Domain, LearningResource } from "@/types/talents";

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

  const matchedByResourceId = useMemo(
    () =>
      new Map(
        LEARNING_RESOURCES.map((resource) => [
          resource.id,
          getResourceMatches(resource, myTalentLabels),
        ]),
      ),
    [myTalentLabels],
  );

  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        learningFilterOptions.map((option) => {
          if (option === "All") return [option, LEARNING_RESOURCES.length];
          if (option === "For me") {
            return [
              option,
              LEARNING_RESOURCES.filter(
                (resource) =>
                  (matchedByResourceId.get(resource.id)?.length ?? 0) > 0,
              ).length,
            ];
          }

          return [
            option,
            LEARNING_RESOURCES.filter((resource) => resource.domain === option)
              .length,
          ];
        }),
      ) as Record<LearningFilter, number>,
    [matchedByResourceId],
  );

  const resources = useMemo(() => {
    if (filter === "All") return LEARNING_RESOURCES;
    if (filter === "For me") {
      return [...LEARNING_RESOURCES].sort((a, b) => {
        const aMatch = matchedByResourceId.get(a.id)?.length ?? 0;
        const bMatch = matchedByResourceId.get(b.id)?.length ?? 0;
        return bMatch - aMatch;
      });
    }

    return LEARNING_RESOURCES.filter((resource) => resource.domain === filter);
  }, [filter, matchedByResourceId]);

  return {
    filter,
    filterCounts,
    filters: learningFilterOptions,
    matchedByResourceId,
    matchedTalentLabels: myTalentLabels,
    resources,
    setFilter,
  };
}

function getResourceMatches(
  resource: LearningResource,
  talentLabels: Set<string>,
) {
  return resource.tags.filter((tag) => talentLabels.has(tag));
}
