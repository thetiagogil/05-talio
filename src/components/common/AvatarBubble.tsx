import type { CSSProperties } from "react"
import { Avatar } from "antd"
import { DEFAULT_AVATAR } from "../../data/avatars"

type AvatarBubbleProps = {
  value?: string | null
  size?: number
  className?: string
  style?: CSSProperties
}

export function AvatarBubble({
  value,
  size = 40,
  className,
  style,
}: AvatarBubbleProps) {
  return (
    <Avatar
      className={className}
      size={size}
      style={{ fontSize: Math.max(16, Math.round(size * 0.52)), ...style }}
    >
      <span className="app-avatar-symbol">{value ?? DEFAULT_AVATAR}</span>
    </Avatar>
  )
}
