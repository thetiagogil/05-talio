import { Switch } from "antd"
import { useDroppable } from "@dnd-kit/core"
import { EmptyState } from "../../common/EmptyState"
import { progressStyle } from "../../../lib/utils/styleUtils"
import type { Goal, Progress } from "../../../types/talents"
import { DraggableGoalCard } from "./DraggableGoalCard"

type GoalColumnProps = {
  column: Progress
  count: number
  goals: Goal[]
  showApproved: boolean
  onEdit: (goal: Goal) => void
  onShowApprovedChange: (checked: boolean) => void
}

export function GoalColumn({
  column,
  count,
  goals,
  showApproved,
  onEdit,
  onShowApprovedChange,
}: GoalColumnProps) {
  const style = progressStyle(column)
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${column}`,
    data: { progress: column },
  })

  return (
    <section
      className={isOver ? "goals-column goals-column-over" : "goals-column"}
      ref={setNodeRef}
    >
      <div className="goals-column-head">
        <div>
          <span className="domain-dot" style={{ background: style.base }} />
          <h3>{column}</h3>
          <small>{count}</small>
        </div>
        {column === "Done" && (
          <label className="show-approved-toggle">
            Show approved
            <Switch
              checked={showApproved}
              size="small"
              onChange={onShowApprovedChange}
            />
          </label>
        )}
      </div>

      <div className="goals-list">
        {goals.length === 0 ? (
          <EmptyState description="Nothing here yet" />
        ) : (
          goals.map((goal) => {
            const locked = goal.progress === "Done" && goal.approved

            return (
              <DraggableGoalCard
                goal={goal}
                key={goal.id}
                locked={locked}
                onEdit={() => onEdit(goal)}
              />
            )
          })
        )}
      </div>
    </section>
  )
}
