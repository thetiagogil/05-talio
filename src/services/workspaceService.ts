import { useSyncExternalStore } from "react"
import { createSeedState } from "../data/seed"
import { STORAGE_KEYS } from "../lib/constants/storageKeys"
import type {
  ActivityEvent,
  Goal,
  Kudos,
  Manual,
  Talent,
  User,
} from "../types/talents"
import { readStorage, subscribeStorage, writeStorage } from "./storageService"

const seed = createSeedState()
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>()

const emptyUsers: User[] = []
const emptyTalents: Talent[] = []
const emptyGoals: Goal[] = []
const emptyActivity: ActivityEvent[] = []
const emptyKudos: Kudos[] = []

const readCachedStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback

  const raw = localStorage.getItem(key)
  const cached = snapshotCache.get(key)

  if (cached && cached.raw === raw) return cached.value as T

  const value = readStorage<T>(key, fallback)
  snapshotCache.set(key, { raw, value })
  return value
}

const write = (key: string, value: unknown) => {
  snapshotCache.clear()
  writeStorage(key, value)
}

const maxId = (items: { id: number }[]) =>
  items.reduce((max, item) => Math.max(max, item.id), 0)

const addActivity = (
  event: Omit<ActivityEvent, "id" | "createdAt"> & { createdAt?: number },
) => {
  const activity = getActivity()
  const next: ActivityEvent = {
    id: maxId(activity) + 1,
    createdAt: Date.now(),
    ...event,
  }

  write(STORAGE_KEYS.activity, [next, ...activity])
}

export const getTheme = (): "light" | "dark" =>
  readStorage<"light" | "dark">(STORAGE_KEYS.theme, "light")

export const applyThemeFromStorage = () => {
  if (typeof document === "undefined") return
  document.documentElement.classList.toggle("dark", getTheme() === "dark")
}

export const setTheme = (theme: "light" | "dark") => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }

  write(STORAGE_KEYS.theme, theme)
}

export const toggleTheme = () => {
  setTheme(getTheme() === "light" ? "dark" : "light")
}

export const getUsers = () =>
  readStorage<User[]>(STORAGE_KEYS.users, seed.users)

export const getTalents = () =>
  readStorage<Talent[]>(STORAGE_KEYS.talents, seed.talents)

export const getGoals = () =>
  readStorage<Goal[]>(STORAGE_KEYS.goals, seed.goals)

export const getActivity = () =>
  readStorage<ActivityEvent[]>(STORAGE_KEYS.activity, seed.activity)

export const getKudos = () =>
  readStorage<Kudos[]>(STORAGE_KEYS.kudos, seed.kudos)

export const replaceUsers = (users: User[]) => {
  write(STORAGE_KEYS.users, users)
}

export const updateUser = (id: string, patch: Partial<User>) => {
  const users = getUsers()
  const before = users.find((user) => user.id === id)
  const next = users.map((user) =>
    user.id === id ? { ...user, ...patch } : user,
  )

  write(STORAGE_KEYS.users, next)

  if (before && !before.role && patch.role) {
    addActivity({ type: "joined", actorId: id })
  }
}

export const updateManual = (userId: string, patch: Partial<Manual>) => {
  const users = getUsers().map((user) =>
    user.id === userId
      ? { ...user, manual: { ...user.manual, ...patch } }
      : user,
  )

  write(STORAGE_KEYS.users, users)
  addActivity({ type: "manual_updated", actorId: userId })
}

export const addGoal = (goal: Omit<Goal, "id" | "createdAt">): Goal => {
  const goals = getGoals()
  const nextGoal: Goal = {
    ...goal,
    id: maxId(goals) + 1,
    createdAt: Date.now(),
  }

  write(STORAGE_KEYS.goals, [...goals, nextGoal])
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

  write(STORAGE_KEYS.goals, goals)

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
  write(
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

  write(STORAGE_KEYS.goals, goals)
  addActivity({
    type: "goal_approved",
    actorId: approverId,
    targetId: before.userId,
    goalId,
    talentId: before.talentId,
  })
}

export const sendKudos = (kudos: Omit<Kudos, "id" | "createdAt">) => {
  const current = getKudos()
  const next: Kudos = {
    ...kudos,
    id: maxId(current) + 1,
    createdAt: Date.now(),
  }

  write(STORAGE_KEYS.kudos, [next, ...current])
  addActivity({
    type: "kudos_sent",
    actorId: kudos.fromId,
    targetId: kudos.toId,
    talentId: kudos.talentId,
    message: kudos.message,
  })
}

export const markNotificationsRead = () => {
  write(STORAGE_KEYS.notificationsReadAt, Date.now())
}

export const useUsers = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readCachedStorage<User[]>(STORAGE_KEYS.users, seed.users),
    () => emptyUsers,
  )

export const useTalents = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readCachedStorage<Talent[]>(STORAGE_KEYS.talents, seed.talents),
    () => emptyTalents,
  )

export const useGoals = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readCachedStorage<Goal[]>(STORAGE_KEYS.goals, seed.goals),
    () => emptyGoals,
  )

export const useActivity = () =>
  useSyncExternalStore(
    subscribeStorage,
    () =>
      readCachedStorage<ActivityEvent[]>(STORAGE_KEYS.activity, seed.activity),
    () => emptyActivity,
  )

export const useKudos = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readCachedStorage<Kudos[]>(STORAGE_KEYS.kudos, seed.kudos),
    () => emptyKudos,
  )

export const useNotificationsReadAt = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readCachedStorage<number>(STORAGE_KEYS.notificationsReadAt, 0),
    () => 0,
  )

export const useAppTheme = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readCachedStorage<"light" | "dark">(STORAGE_KEYS.theme, "light"),
    () => "light",
  )
