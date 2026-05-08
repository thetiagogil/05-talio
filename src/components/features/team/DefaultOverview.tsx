import { useMemo } from "react"
import { Card, Collapse } from "antd"
import { TeamOutlined } from "@ant-design/icons"
import { AvatarBubble } from "../../common/AvatarBubble"
import { DomainTag } from "../../common/DomainTag"
import { DOMAINS } from "../../../lib/constants/talentConstants"
import { domainStyle } from "../../../lib/utils/styleUtils"
import { useCurrentUser } from "../../../services/authService"
import {
  useTalents,
  useUsers,
} from "../../../services/workspaceService"
import type { Talent } from "../../../types/talents"

export function DefaultOverview() {
  const users = useUsers()
  const talents = useTalents()
  const currentUser = useCurrentUser()

  const domainStats = useMemo(
    () =>
      DOMAINS.map((domain) => {
        const domainTalents = talents.filter((talent) => talent.category === domain)
        const people = users.filter((user) =>
          user.talents.some((talentId) =>
            domainTalents.some((talent) => talent.id === talentId),
          ),
        ).length
        const totalTalents = users.reduce(
          (sum, user) =>
            sum +
            user.talents.filter((talentId) =>
              domainTalents.some((talent) => talent.id === talentId),
            ).length,
          0,
        )

        return { domain, people, totalTalents }
      }),
    [talents, users],
  )

  const topTalents = useMemo(() => {
    const counts = new Map<number, string[]>()

    users.forEach((user) => {
      user.talents.forEach((talentId) => {
        counts.set(talentId, [...(counts.get(talentId) ?? []), user.id])
      })
    })

    return Array.from(counts.entries())
      .map(([talentId, userIds]) => ({
        talent: talents.find((candidate) => candidate.id === talentId),
        userIds,
      }))
      .filter(
        (row): row is { talent: Talent; userIds: string[] } =>
          Boolean(row.talent),
      )
      .sort((a, b) => b.userIds.length - a.userIds.length)
      .slice(0, 10)
  }, [talents, users])

  return (
    <div className="team-default">
      <section>
        <h2>Team domains</h2>
        <p>How your team's strengths are distributed.</p>
        <div className="domain-stat-grid">
          {domainStats.map(({ domain, people, totalTalents }) => {
            const style = domainStyle(domain)

            return (
              <Card
                className="domain-stat-card"
                key={domain}
                style={{ background: style.soft }}
              >
                <span className="domain-dot" style={{ background: style.base }} />
                <h3 style={{ color: style.text }}>{domain}</h3>
                <div>
                  <span>
                    <strong style={{ color: style.text }}>{people}</strong>
                    teammates
                  </span>
                  <span>
                    <strong style={{ color: style.text }}>{totalTalents}</strong>
                    talents
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <section>
        <h2>Team top talents</h2>
        <p>Strengths that show up most across the team.</p>
        <Collapse
          className="team-talents-collapse"
          accordion
          bordered={false}
          items={topTalents.map(({ talent, userIds }) => ({
            key: String(talent.id),
            label: (
              <div className="team-talent-label">
                <DomainTag compact domain={talent.category} label={talent.label} />
                <span>
                  <TeamOutlined /> {userIds.length}
                </span>
              </div>
            ),
            children: (
              <div className="team-talent-people">
                {userIds.map((userId) => {
                  const user = users.find((candidate) => candidate.id === userId)
                  if (!user) return null

                  return (
                    <span key={user.id}>
                      <AvatarBubble value={user.avatar} size={24} />
                      <strong>{user.name}</strong>
                      <small>{user.role}</small>
                      {user.id === currentUser?.id && <em>me</em>}
                    </span>
                  )
                })}
              </div>
            ),
          }))}
        />
      </section>
    </div>
  )
}
