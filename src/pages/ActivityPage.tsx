import { useMemo, type ReactNode } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import {
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons"
import { Card } from "antd"
import { ActivityFeed } from "../components/features/activity/ActivityFeed"
import { AppShell } from "../components/layout/AppShell"
import { PageHeader } from "../components/layout/PageHeader"
import { useCurrentUser } from "../services/authService"
import { useActivity, useKudos, useUsers } from "../services/workspaceService"
import type { ActivityEvent } from "../types/talents"

type ActivityTab = "all" | "kudos" | "goals" | "manuals" | "mine"

const activityTabs: { id: ActivityTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kudos", label: "Kudos" },
  { id: "goals", label: "Goals" },
  { id: "manuals", label: "Manuals" },
  { id: "mine", label: "Mine" },
]

const weekStart = Date.now() - 7 * 86400000

const isActivityTab = (tab: string | undefined): tab is ActivityTab =>
  activityTabs.some((item) => item.id === tab)

export function ActivityPage() {
  const { tab } = useParams()
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const events = useActivity()
  const users = useUsers()
  const kudos = useKudos()
  const activeTab = isActivityTab(tab) ? tab : "all"

  const stats = useMemo(
    () => ({
      kudos: kudos.filter((item) => item.createdAt > weekStart).length,
      goalsCompleted: events.filter(
        (event) =>
          event.type === "goal_completed" && event.createdAt > weekStart,
      ).length,
      manuals: events.filter(
        (event) =>
          (event.type === "manual_updated" || event.type === "joined") &&
          event.createdAt > weekStart,
      ).length,
      active: new Set(
        events
          .filter((event) => event.createdAt > weekStart)
          .map((event) => event.actorId),
      ).size,
    }),
    [events, kudos],
  )

  function filter(event: ActivityEvent) {
    if (activeTab === "all") return true
    if (activeTab === "mine" && currentUser) {
      return event.actorId === currentUser.id || event.targetId === currentUser.id
    }
    if (activeTab === "kudos") return event.type === "kudos_sent"
    if (activeTab === "goals") return event.type.startsWith("goal_")
    if (activeTab === "manuals") {
      return event.type === "manual_updated" || event.type === "joined"
    }

    return true
  }

  if (!isActivityTab(tab)) {
    return <Navigate replace to="/activity/all" />
  }

  return (
    <AppShell>
      <PageHeader
        title="Activity"
        description="A living feed of what your team is working on, sharing, and celebrating."
        tabs={activityTabs}
        activeTab={activeTab}
        onTabChange={(nextTab) => navigate(`/activity/${nextTab}`)}
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
      <span className={`activity-stat-icon ${className}`}>{icon}</span>
      <span className="activity-stat-copy">
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </Card>
  )
}
