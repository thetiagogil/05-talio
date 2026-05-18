import { useDraggable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import type { Goal } from "@/types/talents";
import { GoalCard } from "./GoalCard";

type DraggableGoalCardProps = {
  goal: Goal;
  locked: boolean;
  onEdit: () => void;
};

export function DraggableGoalCard({
  goal,
  locked,
  onEdit,
}: DraggableGoalCardProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: `goal-${goal.id}`,
      disabled: locked,
      data: { goalId: goal.id },
    });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        cursor: locked ? "default" : isDragging ? "grabbing" : "grab",
        touchAction: "none",
        opacity: isDragging ? 0.82 : 1,
        zIndex: isDragging ? 5 : "auto",
      }}
      {...listeners}
      {...attributes}
    >
      <GoalCard goal={goal} onEdit={onEdit} />
    </Box>
  );
}
