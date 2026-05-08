import { Input } from "antd";
import { CheckOutlined, SearchOutlined } from "@ant-design/icons";
import { AvatarBubble } from "../../common/AvatarBubble";
import type { User } from "../../../types/talents";

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

  return (
    <aside className="team-search-panel">
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search teammates"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />

      <div className="team-panel-mode">
        <div>
          <strong>
            {compareMode ? "Compare teammates" : "Browse teammates"}
          </strong>
          <span>
            {compareMode
              ? `${compareIds.length}/5 selected`
              : "Open a profile to learn how they work"}
          </span>
        </div>
      </div>

      {warning && <p className="team-warning">{warning}</p>}

      <div className="team-person-list">
        {users.map((user) => {
          const active = compareMode
            ? compareIds.includes(user.id)
            : selectedUserId === user.id;

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
                <span
                  className={active ? "person-check active" : "person-check"}
                >
                  {active && <CheckOutlined />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
