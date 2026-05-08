import { useMemo } from "react"
import { Card } from "antd"
import { HeartOutlined, StarOutlined } from "@ant-design/icons"
import { AvatarBubble } from "../../common/AvatarBubble"
import { DOMAINS } from "../../../lib/constants/talentConstants"
import { domainStyle } from "../../../lib/utils/styleUtils"
import { useCurrentUser } from "../../../services/authService"
import {
  useKudos,
  useTalents,
  useUsers,
} from "../../../services/workspaceService"
import type { Talent, User } from "../../../types/talents"

export function TeamChemistry() {
  const users = useUsers()
  const talents = useTalents()
  const kudos = useKudos()
  const currentUser = useCurrentUser()

  const domainTopThree = useMemo(
    () =>
      DOMAINS.map((domain) => ({
        domain,
        count: users.reduce((sum, user) => {
          const topThree = user.talents.slice(0, 3)
          return (
            sum +
            topThree.filter(
              (talentId) =>
                talents.find((talent) => talent.id === talentId)?.category ===
                domain,
            ).length
          )
        }, 0),
      })).sort((a, b) => a.count - b.count),
    [talents, users],
  )

  const weakest = domainTopThree[0]
  const strongest = domainTopThree[domainTopThree.length - 1]

  const topReceivers = useMemo(() => {
    const counts = new Map<string, number>()

    kudos.forEach((item) => {
      counts.set(item.toId, (counts.get(item.toId) ?? 0) + 1)
    })

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        user: users.find((candidate) => candidate.id === id),
        count,
      }))
      .filter(
        (row): row is { user: User; count: number } => Boolean(row.user),
      )
  }, [kudos, users])

  return (
    <div className="chemistry-page">
      <div className="chemistry-hero-grid">
        <ChemistryDomainCard
          eyebrow="Team superpower"
          title={strongest.domain}
          text={`${strongest.count} top-3 talents land here. This is where your team naturally shines.`}
        />
        <ChemistryDomainCard
          eyebrow="Watch the gap"
          title={weakest.domain}
          text={`Only ${weakest.count} top-3 talents here. Worth pairing intentionally on these efforts.`}
        />
      </div>

      <Card className="panel-card">
        <div className="card-title-with-icon">
          <HeartOutlined />
          <h3>Most appreciated</h3>
        </div>
        <p>Teammates who've received the most kudos.</p>
        <div className="appreciation-list">
          {topReceivers.length === 0 ? (
            <span>No kudos sent yet.</span>
          ) : (
            topReceivers.map(({ user, count }, index) => (
              <div className="appreciation-row" key={user.id}>
                <small>{index + 1}</small>
                <AvatarBubble value={user.avatar} size={32} />
                <span>
                  <strong>
                    {user.name}
                    {user.id === currentUser?.id && <em> (me)</em>}
                  </strong>
                  <small>{user.role}</small>
                </span>
                <b>
                  <HeartOutlined /> {count}
                </b>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="panel-card">
        <div className="card-title-with-icon">
          <StarOutlined />
          <h3>Pairings to try</h3>
        </div>
        <p>Complementary teammates worth working with.</p>
        <div className="pairings-grid">
          {pairings(users, talents).map(({ first, second, reason }) => (
            <div className="pairing-card" key={`${first.id}-${second.id}`}>
              <div>
                <AvatarBubble value={first.avatar} size={32} />
                <span>+</span>
                <AvatarBubble value={second.avatar} size={32} />
              </div>
              <strong>
                {first.name} &amp; {second.name}
              </strong>
              <p>{reason}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function ChemistryDomainCard({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: (typeof DOMAINS)[number]
  text: string
}) {
  const style = domainStyle(title)

  return (
    <Card className="chemistry-domain-card" style={{ background: style.soft }}>
      <p>{eyebrow}</p>
      <h3 style={{ color: style.text }}>{title}</h3>
      <span>{text}</span>
    </Card>
  )
}

function pairings(users: User[], talents: Talent[]) {
  const out: { first: User; second: User; reason: string }[] = []

  for (let i = 0; i < users.length && out.length < 4; i += 1) {
    for (let j = i + 1; j < users.length && out.length < 4; j += 1) {
      const first = users[i]
      const second = users[j]
      const firstDomains = new Set(
        first.talents
          .slice(0, 5)
          .map((id) => talents.find((talent) => talent.id === id)?.category),
      )
      const secondDomains = new Set(
        second.talents
          .slice(0, 5)
          .map((id) => talents.find((talent) => talent.id === id)?.category),
      )
      const overlap = [...firstDomains].filter(
        (domain) => domain && secondDomains.has(domain),
      )
      const complement = [...firstDomains].filter(
        (domain) => domain && !secondDomains.has(domain),
      )

      if (overlap.length === 1 && complement.length >= 2) {
        out.push({
          first,
          second,
          reason: `Shared ground in ${overlap[0]}, with complementary strengths in ${complement
            .slice(0, 2)
            .join(" & ")}.`,
        })
      }
    }
  }

  return out
}
