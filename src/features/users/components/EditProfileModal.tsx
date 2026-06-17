import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { AVATAR_OPTIONS } from "@/features/users/data/avatars";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { updateUser } from "@/features/users/hooks/useUsers";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const user = useCurrentUser();
  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");

  if (!user) return null;

  const currentUser = user;

  const save = () => {
    updateUser(currentUser.id, {
      name: name.trim() || currentUser.name,
      avatar,
    });
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: "1rem", pt: "0.25rem" }}>
          <TextField
            label="Display name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Box>
            <Box
              component="span"
              sx={{
                display: "block",
                mb: "0.5rem",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Avatar
            </Box>
            <Box
              sx={{
                display: "grid",
                width: "100%",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "0.5rem",
                "@media (max-width: 620px)": {
                  gridTemplateColumns: "repeat(4, 1fr)",
                },
              }}
            >
              {AVATAR_OPTIONS.map((option) => (
                <Box
                  component="button"
                  key={option}
                  type="button"
                  onClick={() => setAvatar(option)}
                  sx={{
                    position: "relative",
                    display: "grid",
                    aspectRatio: "1",
                    placeItems: "center",
                    border: "2px solid",
                    borderColor:
                      avatar === option ? "var(--primary)" : "var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--foreground)",
                    bgcolor:
                      avatar === option
                        ? "color-mix(in oklch, var(--primary) 5%, var(--card))"
                        : "var(--card)",
                    boxShadow:
                      avatar === option
                        ? "0 0 0 4px color-mix(in oklch, var(--primary) 15%, transparent)"
                        : "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    "&:hover": { boxShadow: "var(--shadow-card)" },
                  }}
                >
                  {option}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
