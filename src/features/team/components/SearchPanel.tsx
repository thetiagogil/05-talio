import { Box, Typography } from "@mui/material";
import { SearchPanelField } from "@/features/team/components/SearchPanelField";
import { SearchPanelModeSummary } from "@/features/team/components/SearchPanelModeSummary";
import { SearchPanelResultList } from "@/features/team/components/SearchPanelResultList";
import { SearchPanelWarning } from "@/features/team/components/SearchPanelWarning";
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

export const SearchPanel = ({
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
}: SearchPanelProps) => {
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
      <SearchPanelField query={query} onQueryChange={onQueryChange} />
      <SearchPanelModeSummary
        compareCount={compareIds.length}
        compareMode={compareMode}
      />

      <Typography
        component="span"
        sx={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}
      >
        {query ? `${resultLabel} match "${query.trim()}"` : resultLabel}
      </Typography>

      {warning && <SearchPanelWarning message={warning} />}

      <SearchPanelResultList
        compareIds={compareIds}
        compareMode={compareMode}
        currentUserId={currentUserId}
        onPick={onPick}
        onToggleCompare={onToggleCompare}
        selectedUserId={selectedUserId}
        users={users}
      />
    </Box>
  );
};
