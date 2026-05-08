import { useState } from "react"
import { Button, Input, Modal, Select } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import {
  addGoal,
  deleteGoal,
  updateGoal,
  useCurrentUser,
} from "../../lib/talentsStore"
import type { Goal, Progress, Talent } from "../../types/talents"
import { PROGRESS_COLUMNS } from "./goalConstants"

type GoalFormModalProps = {
  goal: Goal | null
  myTalents: Talent[]
  open: boolean
  onClose: () => void
}

export function GoalFormModal({
  goal,
  myTalents,
  open,
  onClose,
}: GoalFormModalProps) {
  const user = useCurrentUser()
  const [talentId, setTalentId] = useState<number | null>(
    goal?.talentId ?? myTalents[0]?.id ?? null,
  )
  const [progress, setProgress] = useState<Progress>(goal?.progress ?? "To do")
  const [description, setDescription] = useState(goal?.description ?? "")

  function save() {
    if (!user || !talentId || !description.trim()) return

    if (goal) {
      updateGoal(goal.id, {
        talentId,
        progress,
        description: description.trim(),
      })
    } else {
      addGoal({
        userId: user.id,
        talentId,
        progress,
        description: description.trim(),
        approved: false,
      })
    }

    onClose()
  }

  function remove() {
    if (!goal) return
    deleteGoal(goal.id)
    onClose()
  }

  return (
    <Modal
      className="rounded-modal"
      footer={
        <div className="goal-modal-footer">
          {goal ? (
            <Button
              danger
              icon={<DeleteOutlined />}
              type="text"
              onClick={remove}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div>
            <Button type="text" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!description.trim() || !talentId}
              type="primary"
              onClick={save}
            >
              Save
            </Button>
          </div>
        </div>
      }
      open={open}
      title={goal ? "Edit goal" : "New goal"}
      onCancel={onClose}
    >
      <div className="goal-form">
        <label>
          <span>Talent</span>
          <Select
            options={myTalents.map((talent) => ({
              label: talent.label,
              value: talent.id,
            }))}
            placeholder="Pick a talent"
            value={talentId}
            onChange={setTalentId}
          />
        </label>

        <label>
          <span>Progress</span>
          <Select
            options={PROGRESS_COLUMNS.map((column) => ({
              label: column,
              value: column,
            }))}
            value={progress}
            onChange={(value) => setProgress(value)}
          />
        </label>

        <label>
          <span>Goal description</span>
          <Input.TextArea
            rows={4}
            placeholder="What do you want to grow toward?"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>
    </Modal>
  )
}
