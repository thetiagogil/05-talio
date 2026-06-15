import { CheckRounded, CloseRounded, SearchRounded } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AvatarBubble } from "@/features/users/components/AvatarBubble";
import type { User } from "@/types/talents";

type SearchPanelProps = {
  users: User[];
  query: string;
  mode: "overview" | "compare";
  selectedUserId: string | null;
  compareIds: string[];
  warning: string | null;
  currentUserId?: string;
  onQueryChange: (query: string) => void;
  onPick: (id: string) => void;
  onToggleCompare: (id: string) => void;
};

export function SearchPanel({
  users,
  query,
  mode,
  selectedUserId,
  compareIds,
  warning,
  currentUserId,
  onQueryChange,
  onPick,
  onToggleCompare,
}: SearchPanelProps) {
  const compareMode = mode === "compare";
  const resultLabel = `${users.length} ${
    users.length === 1 ? "teammate" : "teammates"
  }`;

  return (
    <Box
      component="aside"
      sx={{
        display: "grid",
        gap: "1rem",
        border: "1px solid var(--border)",
        borderRadius: "0.875rem",
        p: "1rem",
        bgcolor: "var(--card)",
      }}
    >
      <TextField
        fullWidth
        label="Search teammates"
        placeholder="Search teammates"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear teammate search"
                  size="small"
                  onClick={() => onQueryChange("")}
                >
                  <CloseRounded fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          borderRadius: "0.625rem",
          p: "0.75rem",
          bgcolor: "color-mix(in oklch, var(--muted) 50%, transparent)",
        }}
      >
        <Box sx={{ display: "grid", gap: "0.15rem" }}>
          <Typography component="strong" sx={{ fontWeight: 700 }}>
            {compareMode ? "Compare teammates" : "Browse teammates"}
          </Typography>
          <Typography
            component="span"
            sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
          >
            {compareMode
              ? `${compareIds.length}/5 selected`
              : "Open a profile to learn how they work"}
          </Typography>
        </Box>
      </Box>

      <Typography
        component="span"
        sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
      >
        {query ? `${resultLabel} match "${query.trim()}"` : resultLabel}
      </Typography>

      {warning && (
        <Typography
          sx={{
            borderRadius: "0.5rem",
            px: "0.75rem",
            py: "0.5rem",
            color: "var(--destructive)",
            bgcolor: "color-mix(in oklch, var(--destructive) 10%, transparent)",
            fontSize: "0.75rem",
          }}
        >
          {warning}
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          maxHeight: "60vh",
          gap: "0.25rem",
          overflowY: "auto",
          m: "-0.25rem",
          p: "0.25rem",
        }}
      >
        {users.length === 0 ? (
          <Box
            sx={{
              border: "1px dashed var(--border)",
              borderRadius: "0.625rem",
              p: "1rem",
              color: "var(--muted-foreground)",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            No teammates match this search.
          </Box>
        ) : (
          users.map((user) => {
            const active = compareMode
              ? compareIds.includes(user.id)
              : selectedUserId === user.id;

            return (
              <Box
                component="button"
                key={user.id}
                type="button"
                onClick={() =>
                  compareMode ? onToggleCompare(user.id) : onPick(user.id)
                }
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
                <Box
                  component="span"
                  sx={{ display: "grid", minWidth: 0, flex: 1 }}
                >
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
                          bgcolor:
                            "color-mix(in oklch, var(--primary) 12%, transparent)",
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
          })
        )}
      </Box>
    </Box>
  );
}
