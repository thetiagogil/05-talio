import type { ReactNode } from "react"
import { Empty } from "antd"

type EmptyStateProps = {
  title?: string
  description: ReactNode
  className?: string
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={className ? `empty-state ${className}` : "empty-state"}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            {title && <div className="empty-state-title">{title}</div>}
            <div>{description}</div>
          </div>
        }
      />
    </div>
  )
}
