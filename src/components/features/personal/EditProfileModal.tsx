import { useState } from "react"
import { Button, Input, Modal } from "antd"
import { AVATAR_OPTIONS } from "../../../data/avatars"
import { useCurrentUser } from "../../../services/authService"
import { updateUser } from "../../../services/workspaceService"

type EditProfileModalProps = {
  open: boolean
  onClose: () => void
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const user = useCurrentUser()
  const [name, setName] = useState(user?.name ?? "")
  const [avatar, setAvatar] = useState(user?.avatar ?? "")

  if (!user) return null

  const currentUser = user

  function save() {
    updateUser(currentUser.id, {
      name: name.trim() || currentUser.name,
      avatar,
    })
    onClose()
  }

  return (
    <Modal
      className="rounded-modal"
      footer={[
        <Button key="cancel" type="text" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={save}>
          Save
        </Button>,
      ]}
      open={open}
      title="Edit profile"
      onCancel={onClose}
    >
      <div className="edit-profile-form">
        <label>
          <span>Display name</span>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <div>
          <span>Avatar</span>
          <div className="avatar-grid compact">
            {AVATAR_OPTIONS.map((option) => (
              <button
                className={avatar === option ? "avatar-option active" : "avatar-option"}
                key={option}
                type="button"
                onClick={() => setAvatar(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
