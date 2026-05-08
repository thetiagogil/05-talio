import { useMemo, useState, type ReactNode } from "react"
import {
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons"
import { Card } from "antd"
import { AppShell } from "../../components/layout/AppShell"
import { PageHeader } from "../../components/layout/PageHeader"
import {
  useActivity,
  useCurrentUser,
  useKudos,
  useUsers,
} from "../../lib/talentsStore"
import type { ActivityEvent } from "../../types/talents"
import { ActivityFeed } from "./ActivityFeed"

type ActivityTab = "all" | "kudos" | "goals" | "manuals" | "mine"

export function ActivityPage() {
  const currentUser = useCurrentUser()
  const events = useActivity()
  const users = useUsers()
  const kudos = useKudos()
  const [tab, setTab] = useState<ActivityTab>("all")

  const stats = useMemo(() => {
    const latestTimestamp = Math.max(
      0,
      ...events.map((event) => event.createdAt),
      ...kudos.map((item) => item.createdAt),
    )
    const week = latestTimestamp - 7 * 86400000

    return {
      kudos: kudos.filter((item) => item.createdAt > week).length,
      goalsCompleted: events.filter(
        (event) =>
          event.type === "goal_completed" && event.createdAt > week,
      ).length,
      manuals: events.filter(
        (event) =>
          (event.type === "manual_updated" || event.type === "joined") &&
          event.createdAt > week,
      ).length,
      active: new Set(
        events
          .filter((event) => event.createdAt > week)
          .map((event) => event.actorId),
      ).size,
    }
  }, [events, kudos])

  function filter(event: ActivityEvent) {
    if (tab === "all") return true
    if (tab === "mine" && currentUser) {
      return event.actorId === currentUser.id || event.targetId === currentUser.id
    }
    if (tab === "kudos") return event.type === "kudos_sent"
    if (tab === "goals") return event.type.startsWith("goal_")
    if (tab === "manuals") {
      return event.type === "manual_updated" || event.type === "joined"
    }

    return true
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Pulse"
        title="Activity"
        description="A living feed of what your team is working on, sharing, and celebrating."
        tabs={[
          { id: "all", label: "All" },
          { id: "kudos", label: "Kudos" },
          { id: "goals", label: "Goals" },
          { id: "manuals", label: "Manuals" },
          { id: "mine", label: "Mine" },
        ]}
        activeTab={tab}
        onTabChange={(nextTab) => setTab(nextTab as ActivityTab)}
      />

      <div className="page-content">
        <div className="activity-page">
          <div className="activity-stats">
            <ActivityStat
              className="accent"
              icon={<HeartOutlined />}
              label="Kudos this week"
              value={stats.kudos}
            />
            <ActivityStat
              className="done"
              icon={<TrophyOutlined />}
              label="Goals completed"
              value={stats.goalsCompleted}
            />
            <ActivityStat
              className="relationship"
              icon={<BookOutlined />}
              label="Manual updates"
              value={stats.manuals}
            />
            <ActivityStat
              className="strategic"
              icon={<StarOutlined />}
              label="Teammates active"
              value={`${stats.active}/${users.length}`}
            />
          </div>

          <ActivityFeed filter={filter} />
        </div>
      </div>
    </AppShell>
  )
}

function ActivityStat({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode
  label: string
  value: string | number
  className: string
}) {
  return (
    <Card className="activity-stat">
      <span className={className}>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </Card>
  )
}
