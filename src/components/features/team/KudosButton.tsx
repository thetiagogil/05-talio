import { useMemo, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import { HeartOutlined, SendOutlined } from "@ant-design/icons";
import { useCurrentUser } from "../../../services/authService";
import { sendKudos, useTalents } from "../../../services/workspaceService";
import type { User } from "../../../types/talents";

type KudosButtonProps = {
  to: User;
};

export function KudosButton({ to }: KudosButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button icon={<HeartOutlined />} onClick={() => setOpen(true)}>
        Send kudos
      </Button>
      <KudosModal open={open} to={to} onClose={() => setOpen(false)} />
    </>
  );
}

function KudosModal({
  open,
  to,
  onClose,
}: {
  open: boolean;
  to: User;
  onClose: () => void;
}) {
  const currentUser = useCurrentUser();
  const talents = useTalents();
  const [message, setMessage] = useState("");
  const theirTalents = useMemo(
    () =>
      to.talents
        .map((id) => talents.find((talent) => talent.id === id))
        .filter((talent) => Boolean(talent)),
    [talents, to.talents],
  );
  const [talentId, setTalentId] = useState<number | null>(
    theirTalents[0]?.id ?? null,
  );

  function submit() {
    if (!currentUser || !talentId || !message.trim()) return;

    sendKudos({
      fromId: currentUser.id,
      toId: to.id,
      talentId,
      message: message.trim(),
    });

    setMessage("");
    onClose();
  }

  return (
    <Modal
      className="rounded-modal"
      footer={[
        <Button key="cancel" type="text" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          disabled={!message.trim()}
          icon={<SendOutlined />}
          key="send"
          type="primary"
          onClick={submit}
        >
          Send kudos
        </Button>,
      ]}
      open={open}
      title={`Send kudos to ${to.name}`}
      onCancel={onClose}
    >
      <div className="kudos-form">
        <label>
          <span>Talent you noticed</span>
          <Select
            options={theirTalents.map((talent) => ({
              label: talent?.label,
              value: talent?.id,
            }))}
            value={talentId}
            onChange={setTalentId}
          />
        </label>
        <label>
          <span>Your message</span>
          <Input.TextArea
            rows={4}
            placeholder="Be specific. What did they do? What did it unlock?"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
      </div>
    </Modal>
  );
}
