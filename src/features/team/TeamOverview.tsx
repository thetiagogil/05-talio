import { useMemo, useState } from "react"
import { Button, Drawer } from "antd"
import { FilterOutlined } from "@ant-design/icons"
import {
  useCurrentUser,
  useTalents,
  useUsers,
} from "../../lib/talentsStore"
import type { User } from "../../types/talents"
import { ComparePanel } from "./ComparePanel"
import { DefaultOverview } from "./DefaultOverview"
import { PersonDetail } from "./PersonDetail"
import { SearchPanel } from "./SearchPanel"

export function TeamOverview() {
  const currentUser = useCurrentUser()
  const users = useUsers()
  const talents = useTalents()
  const [query, setQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [warning, setWarning] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, users],
  )

  const selectedUser = selectedUserId
    ? users.find((user) => user.id === selectedUserId) ?? null
    : null
  const compareUsers = compareIds
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user))

  const panel = (
    <SearchPanel
      compareIds={compareIds}
      compareMode={compareMode}
      currentUserId={currentUser?.id}
      query={query}
      selectedUserId={selectedUserId}
      users={filteredUsers}
      warning={warning}
      onCompareModeChange={toggleCompareMode}
      onPick={pickPerson}
      onQueryChange={setQuery}
      onToggleCompare={toggleCompare}
    />
  )

  function toggleCompare(id: string) {
    if (compareIds.includes(id)) {
      setCompareIds((current) => current.filter((candidate) => candidate !== id))
      setWarning(null)
      return
    }

    if (compareIds.length >= 5) {
      setWarning("You can compare up to 5 teammates at once.")
      return
    }

    setCompareIds((current) => [...current, id])
    setWarning(null)
  }

  function pickPerson(id: string) {
    setSelectedUserId(id)
    setCompareMode(false)
    setFilterOpen(false)
  }

  function toggleCompareMode() {
    setCompareMode((current) => {
      const next = !current
      if (next) setSelectedUserId(null)
      else setCompareIds([])
      return next
    })
  }

  function resetSelection() {
    setSelectedUserId(null)
    setCompareMode(false)
    setCompareIds([])
    setWarning(null)
  }

  return (
    <div className="team-overview-grid">
      <div className="team-mobile-toolbar">
        <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
          Browse team
        </Button>
        {(selectedUserId || compareMode) && (
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
        title="Browse team"
        onClose={() => setFilterOpen(false)}
      >
        {panel}
      </Drawer>

      <section className="team-main-panel">
        {compareMode ? (
          <ComparePanel
            selected={compareUsers}
            talents={talents}
            onClear={() => setCompareIds([])}
            onRemove={toggleCompare}
          />
        ) : selectedUser ? (
          <PersonDetail user={selectedUser} onBack={() => setSelectedUserId(null)} />
        ) : (
          <DefaultOverview />
        )}
      </section>
    </div>
  )
}
