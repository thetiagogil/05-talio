import { Button, Card } from "antd"
import {
  CheckCircleOutlined,
  EditOutlined,
  LockOutlined,
  StarOutlined,
} from "@ant-design/icons"
import { domainStyle } from "../../../lib/utils/styleUtils"
import { useTalents } from "../../../services/workspaceService"
import type { Goal } from "../../../types/talents"
import { ApprovalRequestPopover } from "./ApprovalRequestPopover"

type GoalCardProps = {
  goal: Goal
  onEdit: () => void
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const talents = useTalents()
  const talent = talents.find((candidate) => candidate.id === goal.talentId)

  if (!talent) return null

  const style = domainStyle(talent.category)
  const locked = goal.progress === "Done" && goal.approved

  return (
    <Card className="goal-card">
      <div className="goal-card-head">
        <span className="goal-talent" style={{ background: style.soft, color: style.text }}>
          <span className="domain-dot" style={{ background: style.base }} />
          {talent.label}
        </span>
        <Button
          aria-label={locked ? "Approved goals are locked" : "Edit goal"}
          disabled={locked}
          icon={locked ? <LockOutlined /> : <EditOutlined />}
          size="small"
          type="text"
          onClick={onEdit}
        />
      </div>
      <p>{goal.description}</p>

      {goal.progress === "Done" && (
        <div className="goal-approval-row">
          {goal.approved ? (
            <span className="approved-pill">
              <CheckCircleOutlined />
              Approved
            </span>
          ) : (
            <>
              <span className="approval-waiting">
                <StarOutlined />
                {(goal.approvalRequests?.length ?? 0) > 0
                  ? `Asked ${goal.approvalRequests?.length}`
                  : "Awaiting approval"}
              </span>
              <ApprovalRequestPopover goal={goal} />
            </>
          )}
        </div>
      )}
    </Card>
  )
}
