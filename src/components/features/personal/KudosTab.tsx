import { useMemo } from "react"
import { Card } from "antd"
import { HeartOutlined } from "@ant-design/icons"
import { AvatarBubble } from "../../common/AvatarBubble"
import { DomainTag } from "../../common/DomainTag"
import { EmptyState } from "../../common/EmptyState"
import { timeAgo } from "../../../lib/utils/format"
import { useCurrentUser } from "../../../services/authService"
import {
  useKudos,
  useTalents,
  useUsers,
} from "../../../services/workspaceService"
import { ActivityFeed } from "../activity/ActivityFeed"

export function KudosTab() {
  const user = useCurrentUser()
  const kudos = useKudos()
  const users = useUsers()
  const talents = useTalents()

  const myKudos = useMemo(() => {
    if (!user) return []

    return kudos
      .filter((item) => item.toId === user.id)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [kudos, user])

  if (!user) return null

  if (myKudos.length === 0) {
    return (
      <EmptyState
        className="large-empty"
        title="No kudos yet"
        description="When teammates send you appreciation, it'll show up here."
      />
    )
  }

  return (
    <div className="kudos-page">
      <section>
        <h2>Things people noticed</h2>
        <p>A wall of appreciation from your team.</p>
      </section>

      <div className="kudos-grid">
        {myKudos.map((item) => {
          const from = users.find((candidate) => candidate.id === item.fromId)
          const talent = talents.find(
            (candidate) => candidate.id === item.talentId,
          )

          return (
            <Card className="kudos-card" key={item.id}>
              <HeartOutlined className="kudos-heart" />
              <blockquote>"{item.message}"</blockquote>
              <div className="kudos-author">
                <AvatarBubble value={from?.avatar} size={40} />
                <div>
                  <strong>{from?.name}</strong>
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
                {talent && <DomainTag compact domain={talent.category} label={talent.label} />}
              </div>
            </Card>
          )
        })}
      </div>

      <section>
        <h3>Recent personal activity</h3>
        <ActivityFeed
          filter={(event) =>
            event.actorId === user.id || event.targetId === user.id
          }
        />
      </section>
    </div>
  )
}
