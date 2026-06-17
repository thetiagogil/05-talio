import { DOMAINS } from "@/features/talents/constants";
import { shortDomain } from "@/shared/utils/style-utils";
import type { Domain, Kudos, Talent, User } from "@/types/talents";

export type TeamDomainStat = {
  domain: Domain;
  totalTalents: number;
};

export type TeamTopTalent = {
  talent: Talent;
  userIds: string[];
};

export type CompareRadarRow = {
  domain: Domain;
  label: string;
  values: { userId: string; userName: string; score: number }[];
};

export type CombinedTalentRow = {
  key: number;
  talent: Talent;
  count: number;
};

export type DomainTopThreeStat = {
  domain: Domain;
  count: number;
};

export type TopKudosReceiver = {
  user: User;
  count: number;
};

export type TeamPairing = {
  first: User;
  second: User;
  reason: string;
};

export const getTeamDomainStats = (
  users: User[],
  talents: Talent[],
): TeamDomainStat[] => {
  const talentById = new Map(talents.map((talent) => [talent.id, talent]));

  return DOMAINS.map((domain) => {
    const totalTalents = users.reduce(
      (sum, user) =>
        sum +
        user.talents.filter(
          (talentId) => talentById.get(talentId)?.category === domain,
        ).length,
      0,
    );

    return { domain, totalTalents };
  });
};

export const getTeamTopTalents = (
  users: User[],
  talents: Talent[],
): TeamTopTalent[] => {
  const talentById = new Map(talents.map((talent) => [talent.id, talent]));
  const counts = new Map<number, string[]>();

  users.forEach((user) => {
    user.talents.forEach((talentId) => {
      counts.set(talentId, [...(counts.get(talentId) ?? []), user.id]);
    });
  });

  return Array.from(counts.entries())
    .map(([talentId, userIds]) => {
      const talent = talentById.get(talentId);
      return talent ? { talent, userIds } : null;
    })
    .filter((row): row is TeamTopTalent => Boolean(row))
    .sort((a, b) => b.userIds.length - a.userIds.length)
    .slice(0, 10);
};

export const getCompareRadarData = (
  selected: User[],
  talents: Talent[],
): CompareRadarRow[] => {
  const talentById = new Map(talents.map((talent) => [talent.id, talent]));

  return DOMAINS.map((domain) => ({
    domain,
    label: shortDomain(domain),
    values: selected.map((user) => ({
      userId: user.id,
      userName: user.name,
      score: user.talents.reduce((sum, talentId, index) => {
        const talent = talentById.get(talentId);
        if (!talent || talent.category !== domain) return sum;
        return sum + (10 - index);
      }, 0),
    })),
  }));
};

export const getCombinedTopTalents = (
  selected: User[],
  talents: Talent[],
): CombinedTalentRow[] => {
  const talentById = new Map(talents.map((talent) => [talent.id, talent]));
  const counts = new Map<number, number>();

  selected.forEach((user) => {
    user.talents.forEach((talentId) => {
      counts.set(talentId, (counts.get(talentId) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, 5)
    .map(([id, count]) => {
      const talent = talentById.get(id);
      return talent ? { key: talent.id, talent, count } : null;
    })
    .filter((item): item is CombinedTalentRow => Boolean(item));
};

export const getDomainTopThreeStats = (
  users: User[],
  talents: Talent[],
): DomainTopThreeStat[] => {
  const talentById = new Map(talents.map((talent) => [talent.id, talent]));

  return DOMAINS.map((domain) => ({
    domain,
    count: users.reduce((sum, user) => {
      const topThree = user.talents.slice(0, 3);
      return (
        sum +
        topThree.filter(
          (talentId) => talentById.get(talentId)?.category === domain,
        ).length
      );
    }, 0),
  })).sort((a, b) => a.count - b.count);
};

export const getTopKudosReceivers = (
  kudos: Kudos[],
  users: User[],
): TopKudosReceiver[] => {
  const userById = new Map(users.map((user) => [user.id, user]));
  const counts = new Map<string, number>();

  kudos.forEach((item) => {
    counts.set(item.toId, (counts.get(item.toId) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const user = userById.get(id);
      return user ? { user, count } : null;
    })
    .filter((row): row is TopKudosReceiver => Boolean(row));
};

export const getTeamPairings = (
  users: User[],
  talents: Talent[],
): TeamPairing[] => {
  const talentById = new Map(talents.map((talent) => [talent.id, talent]));
  const out: TeamPairing[] = [];

  for (let i = 0; i < users.length && out.length < 4; i += 1) {
    for (let j = i + 1; j < users.length && out.length < 4; j += 1) {
      const first = users[i];
      const second = users[j];
      const firstDomains = new Set(
        first.talents
          .slice(0, 5)
          .map((id) => talentById.get(id)?.category)
          .filter((domain): domain is Domain => Boolean(domain)),
      );
      const secondDomains = new Set(
        second.talents
          .slice(0, 5)
          .map((id) => talentById.get(id)?.category)
          .filter((domain): domain is Domain => Boolean(domain)),
      );
      const overlap = [...firstDomains].filter((domain) =>
        secondDomains.has(domain),
      );
      const complement = [...firstDomains].filter(
        (domain) => !secondDomains.has(domain),
      );

      if (overlap.length === 1 && complement.length >= 2) {
        out.push({
          first,
          second,
          reason: `Shared ground in ${overlap[0]}, with complementary strengths in ${complement
            .slice(0, 2)
            .join(" & ")}.`,
        });
      }
    }
  }

  return out;
};
