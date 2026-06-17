import { CheckCircleRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { approveGoal } from "@/features/goals/hooks/useGoals";
import type { Goal, Talent, User } from "@/types/talents";

type ApprovalRequestCardProps = {
  approverId: string;
  goal: Goal;
  owner?: User;
  talent?: Talent;
};

export const ApprovalRequestCard = ({
  approverId,
  goal,
  owner,
  talent,
}: ApprovalRequestCardProps) => (
  <Box
    sx={{
      display: "grid",
      gap: "0.5rem",
      m: "0.25rem",
      borderRadius: "0.75rem",
      p: "0.75rem",
      bgcolor: "color-mix(in oklch, var(--accent2) 10%, transparent)",
      boxShadow:
        "0 0 0 1px color-mix(in oklch, var(--accent2) 20%, transparent)",
    }}
  >
    <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.45 }}>
      <strong>{owner?.name}</strong> asked you to approve a goal
      {talent && (
        <>
          {" "}
          for{" "}
          <Box component="em" sx={{ fontStyle: "italic" }}>
            {talent.label}
          </Box>
        </>
      )}
      .
    </Typography>
    <Typography
      component="span"
      sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
    >
      "{goal.description}"
    </Typography>
    <Button
      size="small"
      startIcon={<CheckCircleRounded />}
      variant="contained"
      onClick={() => approveGoal(goal.id, approverId)}
    >
      Approve goal
    </Button>
  </Box>
);
