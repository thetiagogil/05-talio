import { useMemo, type CSSProperties, type ReactNode } from "react"
import {
  AimOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  ReadOutlined,
  StarOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from "@ant-design/icons"
import { EmptyState } from "../../common/EmptyState"
import { timeAgo } from "../../../lib/utils/format"
import { domainStyle } from "../../../lib/utils/styleUtils"
import {
  useActivity,
  useGoals,
  useTalents,
  useUsers,
} from "../../../services/workspaceService"
import type { ActivityEvent } from "../../../types/talents"

type ActivityFeedProps = {
  filter?: (event: ActivityEvent) => boolean
  emptyText?: string
}

export function ActivityFeed({
  filter,
  emptyText = "Nothing yet - activity will show up here.",
}: ActivityFeedProps) {
  const events = useActivity()

  const list = useMemo(() => {
    const filtered = filter ? events.filter(filter) : events
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt)
  }, [events, filter])

  if (list.length === 0) {
    return <EmptyState description={emptyText} />
  }

  return (
    <ol className="activity-feed">
      {list.map((event) => (
        <ActivityRow event={event} key={event.id} />
      ))}
    </ol>
  )
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const users = useUsers()
  const goals = useGoals()
  const talents = useTalents()
  const actor = users.find((user) => user.id === event.actorId)
  const target = event.targetId
    ? users.find((user) => user.id === event.targetId)
    : null
  const goal = event.goalId
    ? goals.find((candidate) => candidate.id === event.goalId)
    : null
  const talent = event.talentId
    ? talents.find((candidate) => candidate.id === event.talentId)
    : goal
      ? talents.find((candidate) => candidate.id === goal.talentId)
      : null
  const icon = iconFor(event.type)
  const talentStyle = talent ? domainStyle(talent.category) : null
  const isKudos = event.type === "kudos_sent"
  const messageStyle = {
    "--message-accent": talentStyle?.base ?? "var(--primary)",
    "--message-bg": talentStyle?.soft ?? "var(--accent)",
  } as CSSProperties

  return (
    <li className="activity-row">
      <span className={`activity-icon ${icon.className}`}>{icon.node}</span>
      <div className="activity-card">
        <div>
          <p>
            <strong>{actor?.name ?? "Someone"}</strong>{" "}
            {phrase(event, target?.name, talent?.label)}
          </p>
          <time>{timeAgo(event.createdAt)}</time>
        </div>
        {isKudos && event.message && (
          <blockquote
            className="activity-message"
            style={messageStyle}
          >
            <span>{event.message}</span>
          </blockquote>
        )}
        {goal && !isKudos && (
          <span className="activity-goal-detail">{goal.description}</span>
        )}
      </div>
    </li>
  )
}

function iconFor(type: ActivityEvent["type"]): {
  node: ReactNode
  className: string
} {
  switch (type) {
    case "kudos_sent":
      return { node: <HeartOutlined />, className: "accent" }
    case "goal_created":
      return { node: <AimOutlined />, className: "" }
    case "goal_progressed":
      return { node: <StarOutlined />, className: "doing" }
    case "goal_completed":
      return { node: <TrophyOutlined />, className: "done" }
    case "goal_approved":
      return { node: <CheckCircleOutlined />, className: "done" }
    case "manual_updated":
      return { node: <ReadOutlined />, className: "" }
    case "joined":
      return { node: <UserAddOutlined />, className: "accent" }
  }
}

function phrase(
  event: ActivityEvent,
  targetName?: string,
  talentName?: string,
) {
  switch (event.type) {
    case "kudos_sent":
      return (
        <>
          sent kudos to <strong>{targetName}</strong>
          {talentName && (
            <>
              {" "}
              for <em className="display-italic">{talentName}</em>
            </>
          )}
        </>
      )
    case "goal_created":
      return (
        <>
          set a new goal
          {talentName && (
            <>
              {" "}
              linked to <em className="display-italic">{talentName}</em>
            </>
          )}
        </>
      )
    case "goal_progressed":
      return (
        <>
          moved a goal to <strong>{event.message}</strong>
        </>
      )
    case "goal_completed":
      return (
        <>
          completed a goal
          {talentName && (
            <>
              {" "}
              for <em className="display-italic">{talentName}</em>
            </>
          )}
        </>
      )
    case "goal_approved":
      return (
        <>
          approved <strong>{targetName}</strong>'s goal
        </>
      )
    case "manual_updated":
      return <>updated their Manual of Me</>
    case "joined":
      return <>joined the team</>
  }
}
