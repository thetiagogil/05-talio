import { useMemo, useState } from "react";
import AddRounded from "@mui/icons-material/AddRounded";
import { Box, Button, Typography } from "@mui/material";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { PROGRESS_COLUMNS } from "../../../lib/constants/talentConstants";
import { useCurrentUser } from "../../../services/authService";
import {
  updateGoal,
  useGoals,
  useTalents,
} from "../../../services/workspaceService";
import type { Goal, Progress, Talent } from "../../../types/talents";
import { GoalColumn } from "./GoalColumn";
import { GoalFormModal } from "./GoalFormModal";

export function GoalsBoard() {
  const user = useCurrentUser();
  const goals = useGoals();
  const talents = useTalents();
  const [editing, setEditing] = useState<Goal | "new" | null>(null);
  const [showApproved, setShowApproved] = useState(true);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor),
  );

  const myGoals = useMemo(
    () => goals.filter((goal) => goal.userId === user?.id),
    [goals, user?.id],
  );

  const myTalents = useMemo(
    () =>
      (user?.talents ?? [])
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [talents, user?.talents],
  );

  if (!user) return null;

  function handleDragEnd(event: DragEndEvent) {
    const goalId = event.active.data.current?.goalId as number | undefined;
    const progress = event.over?.data.current?.progress as Progress | undefined;

    if (!goalId || !progress) return;

    const goal = myGoals.find((item) => item.id === goalId);
    if (!goal || goal.progress === progress) return;
    if (goal.progress === "Done" && goal.approved) return;

    updateGoal(goal.id, { progress });
  }

  return (
    <Box component="section" sx={{ display: "grid", gap: "1.5rem" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Typography
          sx={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}
        >
          Set growth goals tied to your top talents.
        </Typography>
        <Button
          startIcon={<AddRounded />}
          variant="contained"
          onClick={() => setEditing("new")}
        >
          New goal
        </Button>
      </Box>

      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: "1rem",
          }}
        >
          {PROGRESS_COLUMNS.map((column) => {
            const items = myGoals.filter((goal) => goal.progress === column);
            const visible =
              column === "Done"
                ? items.filter((goal) => showApproved || !goal.approved)
                : items;

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
            );
          })}
        </Box>
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
    </Box>
  );
}
