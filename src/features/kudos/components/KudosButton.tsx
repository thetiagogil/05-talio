import { useMemo, useState } from "react";
import { FavoriteBorderRounded, SendRounded } from "@mui/icons-material";
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
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { sendKudos } from "@/features/kudos/hooks/useKudos";
import { useTalents } from "@/features/talents/hooks/useTalents";
import type { User } from "@/types/talents";

type KudosButtonProps = {
  to: User;
};

export const KudosButton = ({ to }: KudosButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        startIcon={<FavoriteBorderRounded />}
        onClick={() => setOpen(true)}
      >
        Send kudos
      </Button>
      <KudosModal open={open} to={to} onClose={() => setOpen(false)} />
    </>
  );
};

function KudosModal({
  open,
  to,
  onClose,
}: {
  open: boolean;
  to: User;
  onClose: () => void;
}) {
  const currentUser = useCurrentUser();
  const talents = useTalents();
  const [message, setMessage] = useState("");
  const theirTalents = useMemo(
    () =>
      to.talents
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent) => Boolean(talent)),
    [talents, to.talents],
  );
  const [talentId, setTalentId] = useState<number | null>(
    theirTalents[0]?.id ?? null,
  );

  function submit() {
    if (!currentUser || !talentId || !message.trim()) return;

    sendKudos({
      fromId: currentUser.id,
      toId: to.id,
      talentId,
      message: message.trim(),
    });

    setMessage("");
    onClose();
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{`Send kudos to ${to.name}`}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: "1rem", pt: "0.25rem" }}>
          <TextField
            select
            label="Talent you noticed"
            value={talentId ?? ""}
            onChange={(event) => setTalentId(Number(event.target.value))}
          >
            {theirTalents.map((talent) => (
              <MenuItem key={talent?.id} value={talent?.id}>
                {talent?.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            multiline
            label="Your message"
            rows={4}
            placeholder="Be specific. What did they do? What did it unlock?"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={!message.trim()}
          startIcon={<SendRounded />}
          variant="contained"
          onClick={submit}
        >
          Send kudos
        </Button>
      </DialogActions>
    </Dialog>
  );
}
