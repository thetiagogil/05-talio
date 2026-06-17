import { useDraggable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import type { Goal } from "@/types/talents";
import { GoalCard } from "./GoalCard";

type DraggableGoalCardProps = {
  goal: Goal;
  locked: boolean;
  onEdit: () => void;
};

export const DraggableGoalCard = ({
  goal,
  locked,
  onEdit,
}: DraggableGoalCardProps) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: `goal-${goal.id}`,
      disabled: locked,
      data: { goalId: goal.id },
    });

  return (
    <Box
      ref={setNodeRef}
      aria-label={locked ? "Approved goal" : "Drag goal"}
      sx={{
        borderRadius: "0.75rem",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        cursor: locked ? "default" : isDragging ? "grabbing" : "grab",
        touchAction: "none",
        opacity: isDragging ? 0.82 : 1,
        zIndex: isDragging ? 5 : "auto",
        "&:focus-visible": {
          outline:
            "3px solid color-mix(in oklch, var(--primary) 28%, transparent)",
          outlineOffset: "3px",
        },
      }}
      {...listeners}
      {...attributes}
    >
      <GoalCard goal={goal} onEdit={onEdit} />
    </Box>
  );
};
