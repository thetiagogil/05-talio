export type Domain =
  | "Executing"
  | "Influencing"
  | "Relationship Building"
  | "Strategic Thinking"

export type RoleName = "Developer" | "Designer" | "Operations" | "Product"

export type Progress = "To do" | "Doing" | "Done"

export type ResourceType = "Article" | "Talk" | "Exercise" | "Podcast"

export type ActivityType =
  | "manual_updated"
  | "goal_created"
  | "goal_progressed"
  | "goal_completed"
  | "goal_approved"
  | "kudos_sent"
  | "joined"

export type Manual = {
  about: string
  needs: string
  feedback: string
  happiness: string
  passions: string
}

export type User = {
  id: string
  name: string
  email: string
  role: RoleName | null
  avatar: string | null
  manual: Manual
  talents: number[]
}

export type Talent = {
  id: number
  label: string
  description: string
  category: Domain
  details: {
    bring: string
    need: string
    motivate: string
  }
}

export type Goal = {
  id: number
  userId: string
  talentId: number
  description: string
  progress: Progress
  approved: boolean
  createdAt: number
  approvalRequests?: string[]
  approvedBy?: string | null
}

export type ActivityEvent = {
  id: number
  type: ActivityType
  actorId: string
  targetId?: string
  goalId?: number
  talentId?: number
  message?: string
  createdAt: number
}

export type Kudos = {
  id: number
  fromId: string
  toId: string
  talentId: number
  message: string
  createdAt: number
}

export type LearningResource = {
  id: string
  type: ResourceType
  title: string
  source: string
  minutes: number
  domain: Domain
  tags: string[]
}

export const DOMAINS: Domain[] = [
  "Executing",
  "Influencing",
  "Relationship Building",
  "Strategic Thinking",
]

export const ROLES: RoleName[] = [
  "Developer",
  "Designer",
  "Operations",
  "Product",
]
