import type { ReactNode } from "react"

export type PageTab = {
  id: string
  label: string
  disabled?: boolean
}

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  tabs?: PageTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  right?: ReactNode
}

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
          <div className="page-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? "active" : undefined}
                disabled={tab.disabled}
                key={tab.id}
                role="tab"
                type="button"
                onClick={() => onTabChange?.(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
