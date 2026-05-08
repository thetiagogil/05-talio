import { TeamOutlined } from "@ant-design/icons";
import { Card, Collapse } from "antd";
import { useMemo } from "react";
import { DOMAINS } from "../../../lib/constants/talentConstants";
import { domainStyle } from "../../../lib/utils/styleUtils";
import { useCurrentUser } from "../../../services/authService";
import { useTalents, useUsers } from "../../../services/workspaceService";
import type { Talent, User } from "../../../types/talents";
import { AvatarBubble } from "../../common/AvatarBubble";
import { DomainTag } from "../../common/DomainTag";

export function DefaultOverview() {
  const users = useUsers();
  const talents = useTalents();
  const currentUser = useCurrentUser();

  const domainStats = useMemo(
    () =>
      DOMAINS.map((domain) => {
        const domainTalents = talents.filter(
          (talent) => talent.category === domain,
        );
        const totalTalents = users.reduce(
          (sum, user) =>
            sum +
            user.talents.filter((talentId) =>
              domainTalents.some((talent) => talent.id === talentId),
            ).length,
          0,
        );

        return { domain, totalTalents };
      }),
    [talents, users],
  );

  const topTalents = useMemo(() => {
    const counts = new Map<number, string[]>();

    users.forEach((user) => {
      user.talents.forEach((talentId) => {
        counts.set(talentId, [...(counts.get(talentId) ?? []), user.id]);
      });
    });

    return Array.from(counts.entries())
      .map(([talentId, userIds]) => ({
        talent: talents.find((candidate) => candidate.id === talentId),
        userIds,
      }))
      .filter((row): row is { talent: Talent; userIds: string[] } =>
        Boolean(row.talent),
      )
      .sort((a, b) => b.userIds.length - a.userIds.length)
      .slice(0, 10);
  }, [talents, users]);

  return (
    <div className="team-default">
      <section>
        <h2>Team domains</h2>
        <p>How your team's strengths are distributed.</p>
        <div className="domain-stat-grid">
          {domainStats.map(({ domain, totalTalents }) => {
            const style = domainStyle(domain);

            return (
              <Card
                className="domain-stat-card"
                key={domain}
                style={{ background: style.soft }}
              >
                <div className="domain-stat-card-head">
                  <span
                    className="domain-dot"
                    style={{ background: style.base }}
                  />
                  <h3 style={{ color: style.text }}>{domain}</h3>
                </div>
                <div className="domain-stat-metrics">
                  <span style={{ borderColor: style.base }}>
                    <strong style={{ color: style.text }}>
                      {totalTalents}
                    </strong>
                    talents
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2>Team top talents</h2>
        <p>Strengths that show up most across the team.</p>
        <Collapse
          accordion
          bordered={false}
          className="team-talents-collapse"
          expandIconPosition="end"
          items={topTalents.map(({ talent, userIds }, index) => {
            const people = userIds
              .map((userId) =>
                users.find((candidate) => candidate.id === userId),
              )
              .filter((user): user is User => Boolean(user));
            const peopleLabel = `${people.length} ${
              people.length === 1 ? "person" : "people"
            }`;

            return {
              key: String(talent.id),
              label: (
                <div className="team-talent-accordion-label">
                  <span className="team-talent-rank">{index + 1}</span>
                  <div className="team-talent-summary">
                    <DomainTag
                      compact
                      domain={talent.category}
                      label={talent.label}
                    />
                    <p>{talent.description}</p>
                  </div>
                  <div className="team-talent-meta">
                    <span className="team-talent-count">
                      <TeamOutlined /> {peopleLabel}
                    </span>
                  </div>
                </div>
              ),
              children: (
                <div className="team-talent-accordion-body">
                  <div className="team-talent-detail">
                    <strong>Brings</strong>
                    <span>{talent.details.bring}</span>
                  </div>
                  <div className="team-talent-members">
                    {people.map((user) => (
                      <span key={user.id}>
                        <AvatarBubble value={user.avatar} size={24} />
                        <strong>{user.name}</strong>
                        <small>{user.role}</small>
                        {user.id === currentUser?.id && <em>me</em>}
                      </span>
                    ))}
                  </div>
                </div>
              ),
            };
          })}
        />
      </section>
    </div>
  );
}
