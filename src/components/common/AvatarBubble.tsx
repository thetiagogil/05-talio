import { Avatar, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { DEFAULT_AVATAR } from "../../data/avatars";

type AvatarBubbleProps = {
  value?: string | null;
  size?: number;
  sx?: SxProps<Theme>;
};

export function AvatarBubble({ value, size = 40, sx }: AvatarBubbleProps) {
  return (
    <Avatar
      sx={[
        {
          width: size,
          height: size,
          bgcolor: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          boxShadow: "0 0 0 1px var(--border)",
          backdropFilter: "blur(8px)",
          fontSize: Math.max(16, Math.round(size * 0.52)),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box component="span" sx={{ lineHeight: 1 }}>
        {value ?? DEFAULT_AVATAR}
      </Box>
    </Avatar>
  );
}
