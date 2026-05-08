import { useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "../lib/constants/storageKeys"
import type { Goal } from "../types/talents"
import { readStorage, subscribeStorage } from "./storageService"
import { addActivity } from "./activityService"
import {
  maxId,
  readWorkspaceSnapshot,
  seed,
  writeWorkspaceStorage,
} from "./workspaceStore"

const emptyGoals: Goal[] = []

export const getGoals = () =>
  readStorage<Goal[]>(STORAGE_KEYS.goals, seed.goals)

export const addGoal = (goal: Omit<Goal, "id" | "createdAt">): Goal => {
  const goals = getGoals()
  const nextGoal: Goal = {
    ...goal,
    id: maxId(goals) + 1,
    createdAt: Date.now(),
  }

  writeWorkspaceStorage(STORAGE_KEYS.goals, [...goals, nextGoal])
  addActivity({
    type: "goal_created",
    actorId: goal.userId,
    goalId: nextGoal.id,
    talentId: goal.talentId,
  })

  return nextGoal
}

export const updateGoal = (id: number, patch: Partial<Goal>) => {
  const before = getGoals().find((goal) => goal.id === id)
  const goals = getGoals().map((goal) =>
    goal.id === id ? { ...goal, ...patch } : goal,
  )

  writeWorkspaceStorage(STORAGE_KEYS.goals, goals)

  if (!before || !patch.progress || patch.progress === before.progress) return

  if (patch.progress === "Done") {
    addActivity({
      type: "goal_completed",
      actorId: before.userId,
      goalId: id,
      talentId: before.talentId,
    })
    return
  }

  addActivity({
    type: "goal_progressed",
    actorId: before.userId,
    goalId: id,
    talentId: before.talentId,
    message: patch.progress,
  })
}

export const deleteGoal = (id: number) => {
  writeWorkspaceStorage(
    STORAGE_KEYS.goals,
    getGoals().filter((goal) => goal.id !== id),
  )
}

export const requestApproval = (goalId: number, approverIds: string[]) => {
  updateGoal(goalId, { approvalRequests: approverIds })
}

export const approveGoal = (goalId: number, approverId: string) => {
  const before = getGoals().find((goal) => goal.id === goalId)
  if (!before) return

  const goals = getGoals().map((goal) =>
    goal.id === goalId
      ? {
          ...goal,
          approved: true,
          approvedBy: approverId,
        }
      : goal,
  )

  writeWorkspaceStorage(STORAGE_KEYS.goals, goals)
  addActivity({
    type: "goal_approved",
    actorId: approverId,
    targetId: before.userId,
    goalId,
    talentId: before.talentId,
  })
}

export const useGoals = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readWorkspaceSnapshot<Goal[]>(STORAGE_KEYS.goals, seed.goals),
    () => emptyGoals,
  )
