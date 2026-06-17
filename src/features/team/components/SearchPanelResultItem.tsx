import { CheckRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import type { User } from "@/types/talents";

type SearchPanelResultItemProps = {
  active: boolean;
  compareMode: boolean;
  currentUserId?: string;
  onPick: (id: string) => void;
  onToggleCompare: (id: string) => void;
  user: User;
};

export const SearchPanelResultItem = ({
  active,
  compareMode,
  currentUserId,
  onPick,
  onToggleCompare,
  user,
}: SearchPanelResultItemProps) => (
  <Box
    component="button"
    type="button"
    onClick={() => (compareMode ? onToggleCompare(user.id) : onPick(user.id))}
    sx={{
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "0.75rem",
      border: 0,
      borderRadius: "0.625rem",
      p: "0.5rem",
      color: "var(--foreground)",
      bgcolor: active
        ? "color-mix(in oklch, var(--primary) 9%, var(--accent))"
        : "transparent",
      boxShadow: active
        ? "0 0 0 1px color-mix(in srgb, var(--primary) 42%, transparent)"
        : "none",
      textAlign: "left",
      cursor: "pointer",
      "&:hover": {
        bgcolor: active
          ? "color-mix(in oklch, var(--primary) 10%, var(--accent))"
          : "var(--muted)",
      },
      "&:focus-visible": {
        outline:
          "2px solid color-mix(in srgb, var(--primary) 70%, transparent)",
        outlineOffset: 2,
      },
    }}
  >
    <AvatarBubble value={user.avatar} size={36} />
    <Box component="span" sx={{ display: "grid", minWidth: 0, flex: 1 }}>
      <Typography
        component="strong"
        sx={{
          overflow: "hidden",
          fontSize: "0.875rem",
          fontWeight: 700,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {user.name}
        {user.id === currentUserId && (
          <Box
            component="small"
            sx={{
              ml: "0.35rem",
              borderRadius: 999,
              px: "0.35rem",
              py: "0.05rem",
              color: "var(--primary)",
              bgcolor: "color-mix(in oklch, var(--primary) 12%, transparent)",
              fontSize: "0.625rem",
            }}
          >
            me
          </Box>
        )}
      </Typography>
      <Typography
        component="em"
        sx={{
          overflow: "hidden",
          color: "var(--muted-foreground)",
          fontSize: "0.75rem",
          fontStyle: "normal",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {user.role ?? "Team member"}
      </Typography>
    </Box>
    {compareMode && (
      <Box
        component="span"
        sx={{
          display: "grid",
          width: "1.25rem",
          height: "1.25rem",
          placeItems: "center",
          border: "2px solid",
          borderColor: active ? "var(--primary)" : "var(--border)",
          borderRadius: "0.35rem",
          color: active ? "var(--primary-foreground)" : "inherit",
          bgcolor: active ? "var(--primary)" : "transparent",
        }}
      >
        {active && <CheckRounded sx={{ fontSize: "0.95rem" }} />}
      </Box>
    )}
  </Box>
);
