import { useMemo, useState } from "react"
import { Button, Card, Tabs } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { AvatarBubble } from "../../common/AvatarBubble"
import { TalentRow } from "../../common/TalentRow"
import { useCurrentUser } from "../../../services/authService"
import { useTalents } from "../../../services/workspaceService"
import type { Talent, User } from "../../../types/talents"
import { ManualEditor } from "../personal/ManualEditor"
import { KudosButton } from "./KudosButton"

type PersonDetailProps = {
  user: User
  onBack: () => void
}

type PersonTab = "profile" | "manual"

export function PersonDetail({ user, onBack }: PersonDetailProps) {
  const currentUser = useCurrentUser()
  const talents = useTalents()
  const [tab, setTab] = useState<PersonTab>("profile")
  const userTalents = useMemo(
    () =>
      user.talents
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent): talent is Talent => Boolean(talent)),
    [talents, user.talents],
  )
  const hasManual = Object.values(user.manual).some((value) => value.trim())

  return (
    <div className="person-detail">
      <Button icon={<ArrowLeftOutlined />} type="text" onClick={onBack}>
        Back to team
      </Button>

      <Card className="person-card">
        <div className="person-hero grain">
          <div>
            <AvatarBubble value={user.avatar} size={80} />
            <span>
              <p>{user.role}</p>
              <h2>
                {user.name}
                {user.id === currentUser?.id && <em>me</em>}
              </h2>
            </span>
          </div>
          {user.id !== currentUser?.id && <KudosButton to={user} />}
        </div>

        <Tabs
          activeKey={tab}
          className="person-tabs"
          items={[
            { key: "profile", label: "Profile" },
            {
              key: "manual",
              label: hasManual ? (
                "Manual of me"
              ) : (
                <span className="disabled-tab-label">
                  Manual of me <small>Empty</small>
                </span>
              ),
              disabled: !hasManual,
            },
          ]}
          onChange={(value) => setTab(value as PersonTab)}
        />

        <div className="person-tab-content">
          {tab === "profile" ? (
            <div className="talent-stack">
              {userTalents.map((talent, index) => (
                <TalentRow
                  key={talent.id}
                  rank={index + 1}
                  talent={talent}
                />
              ))}
            </div>
          ) : (
            <ManualEditor readOnly manual={user.manual} />
          )}
        </div>
      </Card>
    </div>
  )
}
