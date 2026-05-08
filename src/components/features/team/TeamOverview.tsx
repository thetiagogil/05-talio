import { useMemo, useState } from "react";
import { Button, Drawer } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useCurrentUser } from "../../../services/authService";
import { useTalents, useUsers } from "../../../services/workspaceService";
import type { User } from "../../../types/talents";
import { ComparePanel } from "./ComparePanel";
import { DefaultOverview } from "./DefaultOverview";
import { PersonDetail } from "./PersonDetail";
import { SearchPanel } from "./SearchPanel";

type TeamOverviewProps = {
  mode: "overview" | "compare";
};

export function TeamOverview({ mode }: TeamOverviewProps) {
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

  function toggleCompare(id: string) {
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
  }

  function pickPerson(id: string) {
    setSelectedUserId(id);
    setFilterOpen(false);
  }

  function resetSelection() {
    setSelectedUserId(null);
    setCompareIds([]);
    setWarning(null);
  }

  return (
    <div className="team-overview-grid">
      <div className="team-mobile-toolbar">
        <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
          {mode === "compare" ? "Choose people" : "Browse team"}
        </Button>
        {(selectedUserId || compareIds.length > 0) && (
          <Button type="text" onClick={resetSelection}>
            Reset
          </Button>
        )}
      </div>

      <div className="team-desktop-panel">{panel}</div>

      <Drawer
        className="team-filter-drawer"
        open={filterOpen}
        placement="right"
        title={mode === "compare" ? "Choose people" : "Browse team"}
        onClose={() => setFilterOpen(false)}
      >
        {panel}
      </Drawer>

      <section className="team-main-panel">
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
      </section>
    </div>
  );
}
