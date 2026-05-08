import { useMemo, useState } from "react"
import { Button, Switch } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { EmptyState } from "../../common/EmptyState"
import { PROGRESS_COLUMNS } from "../../../lib/constants/talentConstants"
import { progressStyle } from "../../../lib/utils/styleUtils"
import { useCurrentUser } from "../../../services/authService"
import { useGoals, useTalents } from "../../../services/workspaceService"
import type { Goal, Talent } from "../../../types/talents"
import { GoalCard } from "./GoalCard"
import { GoalFormModal } from "./GoalFormModal"

export function GoalsBoard() {
  const user = useCurrentUser()
  const goals = useGoals()
  const talents = useTalents()
  const [editing, setEditing] = useState<Goal | "new" | null>(null)
  const [showApproved, setShowApproved] = useState(true)

  const myGoals = useMemo(
    () => goals.filter((goal) => goal.userId === user?.id),
    [goals, user?.id],
  )

  const myTalents = useMemo(
    () =>
      (user?.talents ?? [])
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [talents, user?.talents],
  )

  if (!user) return null

  return (
    <section className="goals-board">
      <div className="goals-toolbar">
        <p>Set growth goals tied to your top talents.</p>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setEditing("new")}
        >
          New goal
        </Button>
      </div>

      <div className="goals-columns">
        {PROGRESS_COLUMNS.map((column) => {
          const items = myGoals.filter((goal) => goal.progress === column)
          const visible =
            column === "Done"
              ? items.filter((goal) => showApproved || !goal.approved)
              : items
          const style = progressStyle(column)

          return (
            <section className="goals-column" key={column}>
              <div className="goals-column-head">
                <div>
                  <span className="domain-dot" style={{ background: style.base }} />
                  <h3>{column}</h3>
                  <small>{items.length}</small>
                </div>
                {column === "Done" && (
                  <label className="show-approved-toggle">
                    Show approved
                    <Switch
                      checked={showApproved}
                      size="small"
                      onChange={setShowApproved}
                    />
                  </label>
                )}
              </div>

              <div className="goals-list">
                {visible.length === 0 ? (
                  <EmptyState description="Nothing here yet" />
                ) : (
                  visible.map((goal) => (
                    <GoalCard
                      goal={goal}
                      key={goal.id}
                      onEdit={() => setEditing(goal)}
                    />
                  ))
                )}
              </div>
            </section>
          )
        })}
      </div>

      {editing !== null && (
        <GoalFormModal
          goal={editing === "new" ? null : editing}
          key={editing === "new" ? "new" : editing.id}
          myTalents={myTalents}
          open
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  )
}
