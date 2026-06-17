import { Box } from "@mui/material";
import { AVATAR_OPTIONS, DEFAULT_AVATAR } from "@/features/users/data/avatars";

type SetupAvatarStepProps = {
  avatar: string | null;
  onAvatarChange: (avatar: string) => void;
};

export const SetupAvatarStep = ({
  avatar,
  onAvatarChange,
}: SetupAvatarStepProps) => {
  return (
    <Box sx={{ display: "grid", gap: "2rem", justifyItems: "center" }}>
      <Box
        sx={{
          display: "grid",
          width: "8rem",
          height: "8rem",
          placeItems: "center",
          borderRadius: "1rem",
          bgcolor: "var(--accent)",
          boxShadow:
            "0 0 0 4px color-mix(in srgb, var(--primary) 10%, transparent)",
          fontSize: "4rem",
          opacity: avatar ? 1 : 0.5,
        }}
      >
        {avatar ?? DEFAULT_AVATAR}
      </Box>
      <Box
        sx={{
          display: "grid",
          width: "100%",
          gridTemplateColumns: { xs: "repeat(4, 1fr)", md: "repeat(8, 1fr)" },
          gap: "0.75rem",
        }}
      >
        {AVATAR_OPTIONS.map((option) => (
          <SetupAvatarOption
            active={avatar === option}
            avatar={option}
            key={option}
            onClick={() => onAvatarChange(option)}
          />
        ))}
      </Box>
    </Box>
  );
};

const SetupAvatarOption = ({
  active,
  avatar,
  onClick,
}: {
  active: boolean;
  avatar: string;
  onClick: () => void;
}) => {
  return (
    <Box
      component="button"
      aria-label={`Choose avatar ${avatar}`}
      aria-pressed={active}
      type="button"
      onClick={onClick}
      sx={{
        position: "relative",
        display: "grid",
        aspectRatio: "1",
        placeItems: "center",
        border: "2px solid",
        borderColor: active ? "var(--primary)" : "var(--border)",
        borderRadius: "0.75rem",
        color: "var(--foreground)",
        bgcolor: active
          ? "color-mix(in oklch, var(--primary) 5%, var(--card))"
          : "var(--card)",
        boxShadow: active
          ? "0 0 0 4px color-mix(in oklch, var(--primary) 15%, transparent)"
          : "none",
        fontSize: "1.5rem",
        cursor: "pointer",
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "var(--shadow-card)",
        },
        "&:focus-visible": {
          outline:
            "3px solid color-mix(in oklch, var(--primary) 28%, transparent)",
          outlineOffset: "3px",
        },
      }}
    >
      {avatar}
    </Box>
  );
};
