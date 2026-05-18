import {
  CheckCircleRounded,
  EditRounded,
  LockRounded,
  StarBorderRounded,
} from "@mui/icons-material";
import { Box, Card, IconButton, Typography } from "@mui/material";
import { domainStyle } from "@/shared/utils/style-utils";
import { useTalents } from "@/features/talents/hooks/useTalents";
import type { Goal } from "@/types/talents";
import { ApprovalRequestPopover } from "./ApprovalRequestPopover";

type GoalCardProps = {
  goal: Goal;
  onEdit: () => void;
};

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const talents = useTalents();
  const talent = talents.find((candidate) => candidate.id === goal.talentId);

  if (!talent) return null;

  const style = domainStyle(talent.category);
  const locked = goal.progress === "Done" && goal.approved;

  return (
    <Card
      sx={{
        p: "0.75rem",
        borderRadius: "0.75rem",
        boxShadow: "var(--shadow-soft)",
        "&:hover": { boxShadow: "var(--shadow-card)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            borderRadius: 999,
            px: "0.55rem",
            py: "0.2rem",
            color: style.text,
            bgcolor: style.soft,
            fontSize: "0.7rem",
            fontWeight: 700,
          }}
        >
          <Box
            component="span"
            sx={{
              width: "0.625rem",
              height: "0.625rem",
              flex: "none",
              borderRadius: 999,
              bgcolor: style.base,
            }}
          />
          {talent.label}
        </Box>
        <IconButton
          aria-label={locked ? "Approved goals are locked" : "Edit goal"}
          disabled={locked}
          size="small"
          onClick={onEdit}
        >
          {locked ? (
            <LockRounded fontSize="small" />
          ) : (
            <EditRounded fontSize="small" />
          )}
        </IconButton>
      </Box>
      <Typography sx={{ mt: "0.6rem", fontSize: "0.875rem", lineHeight: 1.55 }}>
        {goal.description}
      </Typography>

      {goal.progress === "Done" && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            mt: "0.75rem",
          }}
        >
          {goal.approved ? (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                borderRadius: 999,
                px: "0.55rem",
                py: "0.18rem",
                color: "var(--progress-done)",
                bgcolor: "var(--progress-done-soft)",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              <CheckCircleRounded fontSize="inherit" />
              Approved
            </Box>
          ) : (
            <>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  borderRadius: 999,
                  px: "0.55rem",
                  py: "0.18rem",
                  color: "var(--muted-foreground)",
                  bgcolor: "var(--muted)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                <StarBorderRounded fontSize="inherit" />
                {(goal.approvalRequests?.length ?? 0) > 0
                  ? `Asked ${goal.approvalRequests?.length}`
                  : "Awaiting approval"}
              </Box>
              <ApprovalRequestPopover goal={goal} />
            </>
          )}
        </Box>
      )}
    </Card>
  );
}
