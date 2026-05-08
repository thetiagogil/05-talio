import { Input, Switch } from "antd"
import { CheckOutlined, SearchOutlined } from "@ant-design/icons"
import { AvatarBubble } from "../../common/AvatarBubble"
import type { User } from "../../../types/talents"

type SearchPanelProps = {
  users: User[]
  query: string
  compareMode: boolean
  selectedUserId: string | null
  compareIds: string[]
  warning: string | null
  currentUserId?: string
  onQueryChange: (query: string) => void
  onCompareModeChange: () => void
  onPick: (id: string) => void
  onToggleCompare: (id: string) => void
}

export function SearchPanel({
  users,
  query,
  compareMode,
  selectedUserId,
  compareIds,
  warning,
  currentUserId,
  onQueryChange,
  onCompareModeChange,
  onPick,
  onToggleCompare,
}: SearchPanelProps) {
  return (
    <aside className="team-search-panel">
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search teammates"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />

      <div className="compare-toggle-row">
        <div>
          <strong>Compare mode</strong>
          <span>Pick up to 5 people</span>
        </div>
        <Switch checked={compareMode} onChange={onCompareModeChange} />
      </div>

      {warning && <p className="team-warning">{warning}</p>}

      <div className="team-person-list">
        {users.map((user) => {
          const active = compareMode
            ? compareIds.includes(user.id)
            : selectedUserId === user.id

          return (
            <button
              className={active ? "team-person active" : "team-person"}
              key={user.id}
              type="button"
              onClick={() =>
                compareMode ? onToggleCompare(user.id) : onPick(user.id)
              }
            >
              <AvatarBubble value={user.avatar} size={36} />
              <span>
                <strong>
                  {user.name}
                  {user.id === currentUserId && <small> (me)</small>}
                </strong>
                <em>{user.role}</em>
              </span>
              {compareMode && (
                <span className={active ? "person-check active" : "person-check"}>
                  {active && <CheckOutlined />}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
