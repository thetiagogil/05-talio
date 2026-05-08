import { useState } from "react"
import { Button, Card, Input } from "antd"
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons"
import { updateManual, useCurrentUser } from "../../lib/talentsStore"
import type { Manual } from "../../types/talents"

const prompts: {
  key: keyof Manual
  question: string
  placeholder: string
}[] = [
  {
    key: "about",
    question: "The basics you should know about me are...",
    placeholder: "How I think, when I do my best work...",
  },
  {
    key: "needs",
    question: "I need...",
    placeholder: "Context, autonomy, deep-work blocks...",
  },
  {
    key: "feedback",
    question: "The best way to give me feedback is...",
    placeholder: "Direct and specific, async, in 1:1s...",
  },
  {
    key: "happiness",
    question: "My talents will be happy when...",
    placeholder: "I'm shaping ambiguous problems...",
  },
  {
    key: "passions",
    question: "Beyond work, I'm really passionate about...",
    placeholder: "Music, hiking, painting...",
  },
]

type ManualEditorProps = {
  readOnly?: boolean
  manual?: Manual
}

export function ManualEditor({ readOnly = false, manual: manualProp }: ManualEditorProps) {
  const currentUser = useCurrentUser()
  const manual = manualProp ?? currentUser?.manual

  if (!manual) return null

  return (
    <div className="manual-stack">
      {prompts.map((prompt) => (
        <ManualCard
          key={prompt.key}
          field={prompt.key}
          question={prompt.question}
          placeholder={prompt.placeholder}
          readOnly={readOnly}
          value={manual[prompt.key]}
        />
      ))}
    </div>
  )
}

function ManualCard({
  field,
  question,
  placeholder,
  readOnly,
  value,
}: {
  field: keyof Manual
  question: string
  placeholder: string
  readOnly: boolean
  value: string
}) {
  const currentUser = useCurrentUser()
  const [editing, setEditing] = useState(!value && !readOnly)
  const [draft, setDraft] = useState(value)
  const empty = !value.trim()

  function save() {
    if (!currentUser) return
    updateManual(currentUser.id, { [field]: draft.trim() })
    setEditing(false)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  return (
    <Card className={editing ? "manual-card editing" : "manual-card"}>
      <div className="manual-card-head">
        <h3>{question}</h3>
        {!readOnly && !editing && (
          <Button
            icon={<EditOutlined />}
            size="small"
            type="text"
            onClick={() => {
              setDraft(value)
              setEditing(true)
            }}
          >
            {empty ? "Add" : "Edit"}
          </Button>
        )}
      </div>

      {editing ? (
        <div className="manual-edit-area">
          <Input.TextArea
            rows={4}
            placeholder={placeholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div>
            <Button icon={<CloseOutlined />} type="text" onClick={cancel}>
              Cancel
            </Button>
            <Button icon={<CheckOutlined />} type="primary" onClick={save}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className={empty ? "manual-empty" : undefined}>
          {value || (readOnly ? "No answer yet." : placeholder)}
        </p>
      )}
    </Card>
  )
}
