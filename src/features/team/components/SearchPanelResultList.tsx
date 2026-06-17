import { Box } from "@mui/material";
import { SearchPanelResultItem } from "@/features/team/components/SearchPanelResultItem";
import type { User } from "@/types/talents";

type SearchPanelResultListProps = {
  compareIds: string[];
  compareMode: boolean;
  currentUserId?: string;
  onPick: (id: string) => void;
  onToggleCompare: (id: string) => void;
  selectedUserId: string | null;
  users: User[];
};

export const SearchPanelResultList = ({
  compareIds,
  compareMode,
  currentUserId,
  onPick,
  onToggleCompare,
  selectedUserId,
  users,
}: SearchPanelResultListProps) => (
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
      users.map((user) => (
        <SearchPanelResultItem
          active={
            compareMode
              ? compareIds.includes(user.id)
              : selectedUserId === user.id
          }
          compareMode={compareMode}
          currentUserId={currentUserId}
          key={user.id}
          onPick={onPick}
          onToggleCompare={onToggleCompare}
          user={user}
        />
      ))
    )}
  </Box>
);
