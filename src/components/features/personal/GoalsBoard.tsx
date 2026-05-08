import { useMemo, useState } from "react"
import { Button } from "antd"
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { PlusOutlined } from "@ant-design/icons"
import { PROGRESS_COLUMNS } from "../../../lib/constants/talentConstants"
import { useCurrentUser } from "../../../services/authService"
import {
  updateGoal,
  useGoals,
  useTalents,
} from "../../../services/workspaceService"
import type { Goal, Progress, Talent } from "../../../types/talents"
import { GoalColumn } from "./GoalColumn"
import { GoalFormModal } from "./GoalFormModal"

export function GoalsBoard() {
  const user = useCurrentUser()
  const goals = useGoals()
  const talents = useTalents()
  const [editing, setEditing] = useState<Goal | "new" | null>(null)
  const [showApproved, setShowApproved] = useState(true)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor),
  )

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

  function handleDragEnd(event: DragEndEvent) {
    const goalId = event.active.data.current?.goalId as number | undefined
    const progress = event.over?.data.current?.progress as Progress | undefined

    if (!goalId || !progress) return

    const goal = myGoals.find((item) => item.id === goalId)
    if (!goal || goal.progress === progress) return
    if (goal.progress === "Done" && goal.approved) return

    updateGoal(goal.id, { progress })
  }

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

      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="goals-columns">
          {PROGRESS_COLUMNS.map((column) => {
            const items = myGoals.filter((goal) => goal.progress === column)
            const visible =
              column === "Done"
                ? items.filter((goal) => showApproved || !goal.approved)
                : items

            return (
              <GoalColumn
                column={column}
                count={items.length}
                goals={visible}
                key={column}
                showApproved={showApproved}
                onEdit={setEditing}
                onShowApprovedChange={setShowApproved}
              />
            )
          })}
        </div>
      </DndContext>

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
