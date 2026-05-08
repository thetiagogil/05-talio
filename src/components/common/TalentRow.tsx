import { useState } from "react";
import { Card } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { Talent } from "../../types/talents";
import { domainStyle } from "../../lib/utils/styleUtils";

type TalentRowProps = {
  rank: number;
  talent: Talent;
  defaultOpen?: boolean;
};

export function TalentRow({ rank, talent, defaultOpen }: TalentRowProps) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const style = domainStyle(talent.category);

  return (
    <Card className={open ? "talent-row talent-row-open" : "talent-row"}>
      <button
        className="talent-row-trigger"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="talent-rank">{rank}</span>
        <span className="talent-row-main">
          <span className="talent-row-name">
            <span className="domain-dot" style={{ background: style.base }} />
            <span>{talent.label}</span>
          </span>
          <span className="talent-row-domain">{talent.category}</span>
        </span>
        <DownOutlined
          className={open ? "talent-chevron open" : "talent-chevron"}
        />
      </button>

      {open && (
        <div className="talent-row-content">
          <p>{talent.description}</p>
          <div className="talent-details-grid">
            <TalentDetail label="Brings" value={talent.details.bring} />
            <TalentDetail label="Needs" value={talent.details.need} />
            <TalentDetail
              label="Motivated by"
              value={talent.details.motivate}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

function TalentDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="talent-detail">
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}
