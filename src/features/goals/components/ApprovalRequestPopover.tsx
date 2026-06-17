import { useState } from "react";
import { CheckCircleRounded, PersonAddAltRounded } from "@mui/icons-material";
import { Box, Button, Popover, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import { requestApproval } from "@/features/goals/hooks/useGoals";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { Goal } from "@/types/talents";

type ApprovalRequestPopoverProps = {
  goal: Goal;
};

export const ApprovalRequestPopover = ({
  goal,
}: ApprovalRequestPopoverProps) => {
  const users = useUsers();
  const teammates = users.filter((user) => user.id !== goal.userId);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(goal.approvalRequests ?? []),
  );

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }

  function save() {
    requestApproval(goal.id, Array.from(selected));
    setOpen(false);
    setAnchorEl(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setSelected(new Set(goal.approvalRequests ?? []));
    setOpen(nextOpen);
    if (!nextOpen) setAnchorEl(null);
  }

  return (
    <>
      <Button
        size="small"
        startIcon={<PersonAddAltRounded />}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
          handleOpenChange(true);
        }}
      >
        Request
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleOpenChange(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{ display: "grid", width: "16rem", gap: "0.5rem", p: "0.75rem" }}
        >
          <Typography
            sx={{
              color: "var(--muted-foreground)",
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Ask for approval
          </Typography>
          <Box
            sx={{
              display: "grid",
              maxHeight: "15rem",
              gap: "0.25rem",
              overflowY: "auto",
            }}
          >
            {teammates.map((user) => {
              const active = selected.has(user.id);

              return (
                <Box
                  component="button"
                  key={user.id}
                  type="button"
                  onClick={() => toggle(user.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "0.5rem",
                    border: 0,
                    borderRadius: "0.6rem",
                    p: "0.45rem",
                    color: "var(--foreground)",
                    bgcolor: active
                      ? "color-mix(in oklch, var(--accent2) 10%, transparent)"
                      : "transparent",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor:
                        "color-mix(in oklch, var(--accent2) 10%, transparent)",
                    },
                  }}
                >
                  <AvatarBubble value={user.avatar} size={24} />
                  <span>{user.name}</span>
                  {active && (
                    <CheckCircleRounded
                      sx={{ ml: "auto", color: "var(--accent2)" }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
          <Button fullWidth size="small" variant="contained" onClick={save}>
            Save
          </Button>
        </Box>
      </Popover>
    </>
  );
};
