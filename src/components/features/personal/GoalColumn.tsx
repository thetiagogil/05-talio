import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { EmptyState } from "../../common/EmptyState";
import { progressStyle } from "../../../lib/utils/styleUtils";
import type { Goal, Progress } from "../../../types/talents";
import { DraggableGoalCard } from "./DraggableGoalCard";

type GoalColumnProps = {
  column: Progress;
  count: number;
  goals: Goal[];
  showApproved: boolean;
  onEdit: (goal: Goal) => void;
  onShowApprovedChange: (checked: boolean) => void;
};

export function GoalColumn({
  column,
  count,
  goals,
  showApproved,
  onEdit,
  onShowApprovedChange,
}: GoalColumnProps) {
  const style = progressStyle(column);
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${column}`,
    data: { progress: column },
  });

  return (
    <Box
      component="section"
      ref={setNodeRef}
      sx={{
        border: "1px solid",
        borderColor: isOver ? "var(--primary)" : "var(--border)",
        borderRadius: "0.875rem",
        p: "0.75rem",
        bgcolor: isOver
          ? "color-mix(in srgb, var(--primary) 8%, var(--surface-2))"
          : "var(--surface-2)",
        boxShadow: isOver
          ? "0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent)"
          : "none",
        transition:
          "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          mb: "0.75rem",
          px: "0.25rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Box
            component="span"
            sx={{
              width: "0.625rem",
              height: "0.625rem",
              borderRadius: 999,
              bgcolor: style.base,
            }}
          />
          <Typography component="h3" sx={{ fontSize: "1rem", fontWeight: 800 }}>
            {column}
          </Typography>
          <Typography
            component="small"
            sx={{ color: "var(--muted-foreground)" }}
          >
            {count}
          </Typography>
        </Box>
        {column === "Done" && (
          <FormControlLabel
            label="Show approved"
            labelPlacement="start"
            sx={{
              m: 0,
              gap: "0.5rem",
              color: "var(--muted-foreground)",
              "& .MuiFormControlLabel-label": { fontSize: "0.75rem" },
            }}
            control={
              <Switch
                checked={showApproved}
                size="small"
                onChange={(_, checked) => onShowApprovedChange(checked)}
              />
            }
          />
        )}
      </Box>

      <Box sx={{ display: "grid", gap: "0.5rem" }}>
        {goals.length === 0 ? (
          <EmptyState description="Nothing here yet" />
        ) : (
          goals.map((goal) => {
            const locked = goal.progress === "Done" && goal.approved;

            return (
              <DraggableGoalCard
                goal={goal}
                key={goal.id}
                locked={locked}
                onEdit={() => onEdit(goal)}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
}
