import { useMemo, useState } from "react";
import TuneRounded from "@mui/icons-material/TuneRounded";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useTalents } from "@/features/talents/hooks/useTalents";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { User } from "@/types/talents";
import { ComparePanel } from "./ComparePanel";
import { DefaultOverview } from "./DefaultOverview";
import { PersonDetail } from "./PersonDetail";
import { SearchPanel } from "./SearchPanel";

type TeamOverviewProps = {
  mode: "overview" | "compare";
};

export const TeamOverview = ({ mode }: TeamOverviewProps) => {
  const currentUser = useCurrentUser();
  const users = useUsers();
  const talents = useTalents();
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, users],
  );

  const selectedUser = selectedUserId
    ? (users.find((user) => user.id === selectedUserId) ?? null)
    : null;
  const compareUsers = compareIds
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user));

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds((current) =>
        current.filter((candidate) => candidate !== id),
      );
      setWarning(null);
      return;
    }

    if (compareIds.length >= 5) {
      setWarning("You can compare up to 5 teammates at once.");
      return;
    }

    setCompareIds((current) => [...current, id]);
    setWarning(null);
  };

  const pickPerson = (id: string) => {
    setSelectedUserId(id);
    setFilterOpen(false);
  };

  const resetSelection = () => {
    setSelectedUserId(null);
    setCompareIds([]);
    setWarning(null);
  };

  const panel = (
    <SearchPanel
      compareIds={compareIds}
      currentUserId={currentUser?.id}
      mode={mode}
      query={query}
      selectedUserId={selectedUserId}
      users={filteredUsers}
      warning={mode === "compare" ? warning : null}
      onPick={pickPerson}
      onQueryChange={setQuery}
      onToggleCompare={toggleCompare}
    />
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "20rem 1fr" },
        gap: "1.5rem",
      }}
    >
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button startIcon={<TuneRounded />} onClick={() => setFilterOpen(true)}>
          {mode === "compare" ? "Choose people" : "Browse team"}
        </Button>
        {(selectedUserId || compareIds.length > 0) && (
          <Button variant="text" onClick={resetSelection}>
            Reset
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "sticky",
          top: "1.5rem",
          alignSelf: "start",
        }}
      >
        {panel}
      </Box>

      <Drawer
        open={filterOpen}
        anchor="right"
        onClose={() => setFilterOpen(false)}
        slotProps={{ paper: { sx: { width: "20rem", p: "1rem" } } }}
      >
        <Typography
          sx={{
            mb: "1rem",
            fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            fontWeight: 800,
          }}
        >
          {mode === "compare" ? "Choose people" : "Browse team"}
        </Typography>
        {panel}
      </Drawer>

      <Box component="section" sx={{ minWidth: 0 }}>
        {mode === "compare" ? (
          <ComparePanel
            selected={compareUsers}
            talents={talents}
            onClear={() => setCompareIds([])}
            onRemove={toggleCompare}
          />
        ) : selectedUser ? (
          <PersonDetail
            user={selectedUser}
            onBack={() => setSelectedUserId(null)}
          />
        ) : (
          <DefaultOverview />
        )}
      </Box>
    </Box>
  );
};
