import type { ReactNode } from "react";
import { Tabs } from "antd";

export type PageTab = {
  id: string;
  label: string;
  disabled?: boolean;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tabs?: PageTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  right?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  right,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-inner">
        <div className="page-title-row">
          <div>
            {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            {description && <p className="page-description">{description}</p>}
          </div>
          {right && <div className="page-header-right">{right}</div>}
        </div>

        {tabs && (
          <Tabs
            activeKey={activeTab}
            className="page-tabs"
            items={tabs.map((tab) => ({
              key: tab.id,
              label: tab.label,
              disabled: tab.disabled,
            }))}
            onChange={onTabChange}
          />
        )}
      </div>
    </header>
  );
}
