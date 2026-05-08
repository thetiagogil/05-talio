import { useMemo, useState, type ReactNode } from "react"
import { Card, Progress } from "antd"
import {
  EditOutlined,
  HeartOutlined,
  TrophyOutlined,
  AimOutlined,
} from "@ant-design/icons"
import { AvatarBubble } from "../../components/common/AvatarBubble"
import { TalentRow } from "../../components/common/TalentRow"
import {
  useCurrentUser,
  useGoals,
  useKudos,
  useTalents,
} from "../../lib/talentsStore"
import { domainStyle } from "../../lib/styles"
import { DOMAINS, type Talent } from "../../types/talents"
import { EditProfileModal } from "./EditProfileModal"

export function ProfileTab() {
  const user = useCurrentUser()
  const talents = useTalents()
  const goals = useGoals()
  const kudos = useKudos()
  const [editing, setEditing] = useState(false)

  const userTalents = useMemo(
    () =>
      (user?.talents ?? [])
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [talents, user?.talents],
  )

  if (!user) return null

  const myGoals = goals.filter((goal) => goal.userId === user.id)
  const myKudos = kudos.filter((item) => item.toId === user.id)
  const dominantDomain = DOMAINS.map((domain) => ({
    domain,
    count: userTalents.filter((talent) => talent?.category === domain).length,
  })).sort((a, b) => b.count - a.count)[0]?.domain

  return (
    <div className="profile-page-grid">
      <section className="profile-hero grain">
        <button
          aria-label="Change avatar"
          className="profile-avatar-button"
          type="button"
          onClick={() => setEditing(true)}
        >
          <AvatarBubble value={user.avatar} size={128} />
          <span>
            <EditOutlined />
          </span>
        </button>

        <div className="profile-hero-copy">
          <p>{user.role}</p>
          <h2>{user.name}</h2>
          <span>
            You lead with{" "}
            <strong className="display-italic">{userTalents[0]?.label}</strong>
            {dominantDomain && (
              <>
                {" "}
                and most of your strengths fall under{" "}
                <strong>{dominantDomain}</strong>.
              </>
            )}
          </span>
        </div>

        <div className="profile-stats">
          <ProfileStat value={userTalents.length} label="talents" />
          <ProfileStat value={myGoals.length} label="goals" />
          <ProfileStat value={myKudos.length} label="kudos" />
        </div>
      </section>

      <div className="profile-lower-grid">
        <aside className="profile-side">
          <Card className="panel-card">
            <h3 className="panel-eyebrow">Domain breakdown</h3>
            <div className="domain-breakdown">
              {DOMAINS.map((domain) => {
                const count = userTalents.filter(
                  (talent) => talent?.category === domain,
                ).length
                const percent = (count / Math.max(userTalents.length, 1)) * 100
                const style = domainStyle(domain)

                return (
                  <div className="domain-breakdown-row" key={domain}>
                    <div>
                      <span>
                        <span
                          className="domain-dot"
                          style={{ background: style.base }}
                        />
                        {domain}
                      </span>
                      <small>{count}</small>
                    </div>
                    <Progress
                      percent={percent}
                      railColor="var(--muted)"
                      showInfo={false}
                      strokeColor={style.base}
                    />
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="panel-card">
            <h3 className="panel-eyebrow">At a glance</h3>
            <div className="at-glance-list">
              <AtGlanceRow
                icon={<AimOutlined />}
                label="In progress"
                value={myGoals.filter((goal) => goal.progress === "Doing").length}
              />
              <AtGlanceRow
                icon={<TrophyOutlined />}
                label="Completed"
                value={myGoals.filter((goal) => goal.progress === "Done").length}
              />
              <AtGlanceRow
                icon={<HeartOutlined />}
                label="Kudos received"
                value={myKudos.length}
              />
            </div>
          </Card>
        </aside>

        <section>
          <div className="section-title-row">
            <h2>Top 10 talents</h2>
            <span>Tap to expand</span>
          </div>
          <div className="talent-stack">
            {userTalents.map((talent, index) =>
              talent ? (
                <TalentRow
                  defaultOpen={index === 0}
                  key={talent.id}
                  rank={index + 1}
                  talent={talent}
                />
              ) : null,
            )}
          </div>
        </section>
      </div>

      {editing && <EditProfileModal open onClose={() => setEditing(false)} />}
    </div>
  )
}

function ProfileStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="profile-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function AtGlanceRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: number
}) {
  return (
    <div className="at-glance-row">
      <span>
        {icon}
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  )
}
