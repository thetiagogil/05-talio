import type { CSSProperties } from "react"
import { useDraggable } from "@dnd-kit/core"
import type { Goal } from "../../../types/talents"
import { GoalCard } from "./GoalCard"

type DraggableGoalCardProps = {
  goal: Goal
  locked: boolean
  onEdit: () => void
}

export function DraggableGoalCard({
  goal,
  locked,
  onEdit,
}: DraggableGoalCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: `goal-${goal.id}`,
    disabled: locked,
    data: { goalId: goal.id },
  })

  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      className={[
        "goal-drag-wrapper",
        isDragging ? "dragging" : "",
        locked ? "locked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <GoalCard goal={goal} onEdit={onEdit} />
    </div>
  )
}
