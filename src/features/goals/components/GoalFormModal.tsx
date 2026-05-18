import { useState } from "react";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { PROGRESS_COLUMNS } from "@/features/talents/constants";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import {
  addGoal,
  deleteGoal,
  updateGoal,
} from "@/features/goals/hooks/useGoals";
import type { Goal, Progress, Talent } from "@/types/talents";

type GoalFormModalProps = {
  goal: Goal | null;
  myTalents: Talent[];
  open: boolean;
  onClose: () => void;
};

export function GoalFormModal({
  goal,
  myTalents,
  open,
  onClose,
}: GoalFormModalProps) {
  const user = useCurrentUser();
  const [talentId, setTalentId] = useState<number | null>(
    goal?.talentId ?? myTalents[0]?.id ?? null,
  );
  const [progress, setProgress] = useState<Progress>(goal?.progress ?? "To do");
  const [description, setDescription] = useState(goal?.description ?? "");

  function save() {
    if (!user || !talentId || !description.trim()) return;

    if (goal) {
      updateGoal(goal.id, {
        talentId,
        progress,
        description: description.trim(),
      });
    } else {
      addGoal({
        userId: user.id,
        talentId,
        progress,
        description: description.trim(),
        approved: false,
      });
    }

    onClose();
  }

  function remove() {
    if (!goal) return;
    deleteGoal(goal.id);
    onClose();
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{goal ? "Edit goal" : "New goal"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: "1rem", pt: "0.25rem" }}>
          <TextField
            select
            label="Talent"
            placeholder="Pick a talent"
            value={talentId ?? ""}
            onChange={(event) => setTalentId(Number(event.target.value))}
          >
            {myTalents.map((talent) => (
              <MenuItem key={talent.id} value={talent.id}>
                {talent.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Progress"
            value={progress}
            onChange={(event) => setProgress(event.target.value as Progress)}
          >
            {PROGRESS_COLUMNS.map((column) => (
              <MenuItem key={column} value={column}>
                {column}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            multiline
            label="Goal description"
            rows={4}
            placeholder="What do you want to grow toward?"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        {goal ? (
          <Button
            color="error"
            startIcon={<DeleteOutlineRounded />}
            variant="text"
            onClick={remove}
          >
            Delete
          </Button>
        ) : (
          <Box />
        )}
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!description.trim() || !talentId}
            variant="contained"
            onClick={save}
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
