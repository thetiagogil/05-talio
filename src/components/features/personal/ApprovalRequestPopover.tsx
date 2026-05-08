import { useState } from "react";
import { Button, Popover } from "antd";
import { CheckCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { AvatarBubble } from "../../common/AvatarBubble";
import { requestApproval, useUsers } from "../../../services/workspaceService";
import type { Goal } from "../../../types/talents";

type ApprovalRequestPopoverProps = {
  goal: Goal;
};

export function ApprovalRequestPopover({ goal }: ApprovalRequestPopoverProps) {
  const users = useUsers();
  const teammates = users.filter((user) => user.id !== goal.userId);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(goal.approvalRequests ?? []),
  );

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }

  function save() {
    requestApproval(goal.id, Array.from(selected));
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setSelected(new Set(goal.approvalRequests ?? []));
    setOpen(nextOpen);
  }

  return (
    <Popover
      arrow={false}
      open={open}
      placement="bottomRight"
      trigger="click"
      onOpenChange={handleOpenChange}
      content={
        <div className="approval-popover">
          <p>Ask for approval</p>
          <div>
            {teammates.map((user) => {
              const active = selected.has(user.id);

              return (
                <button
                  className={
                    active ? "approval-person active" : "approval-person"
                  }
                  key={user.id}
                  type="button"
                  onClick={() => toggle(user.id)}
                >
                  <AvatarBubble value={user.avatar} size={24} />
                  <span>{user.name}</span>
                  {active && <CheckCircleOutlined />}
                </button>
              );
            })}
          </div>
          <Button block size="small" type="primary" onClick={save}>
            Save
          </Button>
        </div>
      }
    >
      <Button size="small" icon={<UserAddOutlined />}>
        Request
      </Button>
    </Popover>
  );
}
