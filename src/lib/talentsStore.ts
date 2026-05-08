import { useEffect, useSyncExternalStore } from "react"
import { createSeedState } from "../data/seed"
import type {
  ActivityEvent,
  Goal,
  Kudos,
  Manual,
  Talent,
  User,
} from "../types/talents"

const STORAGE_VERSION = "1"
const seed = createSeedState()

const keys = {
  version: "talio.version",
  currentUserId: "talio.currentUserId",
  users: "talio.users",
  talents: "talio.talents",
  goals: "talio.goals",
  activity: "talio.activity",
  kudos: "talio.kudos",
  notificationsReadAt: "talio.notificationsReadAt",
  theme: "talio.theme",
} as const

const listeners = new Set<() => void>()
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>()

function isBrowser() {
  return typeof window !== "undefined"
}

function emit() {
  snapshotCache.clear()
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function cachedRead<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback

  const raw = localStorage.getItem(key)
  const cached = snapshotCache.get(key)

  if (cached && cached.raw === raw) return cached.value as T

  let value: T

  try {
    value = raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    value = fallback
  }

  snapshotCache.set(key, { raw, value })
  return value
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return
  localStorage.setItem(key, JSON.stringify(value))
  emit()
}

function remove(key: string) {
  if (!isBrowser()) return
  localStorage.removeItem(key)
  emit()
}

function maxId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0)
}

function addActivity(
  event: Omit<ActivityEvent, "id" | "createdAt"> & { createdAt?: number },
) {
  const activity = getActivity()
  const next: ActivityEvent = {
    id: maxId(activity) + 1,
    createdAt: Date.now(),
    ...event,
  }

  write(keys.activity, [next, ...activity])
}

export function ensureSeed() {
  if (!isBrowser()) return

  const version = localStorage.getItem(keys.version)

  if (version !== STORAGE_VERSION) {
    localStorage.setItem(keys.version, STORAGE_VERSION)
    localStorage.setItem(keys.users, JSON.stringify(seed.users))
    localStorage.setItem(keys.talents, JSON.stringify(seed.talents))
    localStorage.setItem(keys.goals, JSON.stringify(seed.goals))
    localStorage.setItem(keys.activity, JSON.stringify(seed.activity))
    localStorage.setItem(keys.kudos, JSON.stringify(seed.kudos))
  }

  applyThemeFromStorage()
  emit()
}

export function applyThemeFromStorage() {
  if (!isBrowser()) return
  const nextTheme = getTheme()
  document.documentElement.classList.toggle("dark", nextTheme === "dark")
}

export function getTheme(): "light" | "dark" {
  return read<"light" | "dark">(keys.theme, "light")
}

export function setTheme(theme: "light" | "dark") {
  if (isBrowser()) {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }

  write(keys.theme, theme)
}

export function toggleTheme() {
  setTheme(getTheme() === "light" ? "dark" : "light")
}

export function getUsers(): User[] {
  return read<User[]>(keys.users, seed.users)
}

export function getTalents(): Talent[] {
  return read<Talent[]>(keys.talents, seed.talents)
}

export function getGoals(): Goal[] {
  return read<Goal[]>(keys.goals, seed.goals)
}

export function getActivity(): ActivityEvent[] {
  return read<ActivityEvent[]>(keys.activity, seed.activity)
}

export function getKudos(): Kudos[] {
  return read<Kudos[]>(keys.kudos, seed.kudos)
}

export function getCurrentUserId(): string | null {
  return read<string | null>(keys.currentUserId, null)
}

export function loginByEmail(email: string): User | null {
  ensureSeed()

  const user = getUsers().find(
    (candidate) =>
      candidate.email.toLowerCase() === email.trim().toLowerCase(),
  )

  if (!user) return null

  write(keys.currentUserId, user.id)
  return user
}

export function loginAsTestUser(): User {
  ensureSeed()

  const user =
    getUsers().find((candidate) => candidate.id === "u-test") ?? seed.users[0]

  write(keys.currentUserId, user.id)
  return user
}

export function logout() {
  remove(keys.currentUserId)
}

export function updateUser(id: string, patch: Partial<User>) {
  const users = getUsers()
  const before = users.find((user) => user.id === id)
  const next = users.map((user) =>
    user.id === id ? { ...user, ...patch } : user,
  )

  write(keys.users, next)

  if (before && !before.role && patch.role) {
    addActivity({ type: "joined", actorId: id })
  }
}

export function updateManual(userId: string, patch: Partial<Manual>) {
  const users = getUsers().map((user) =>
    user.id === userId
      ? { ...user, manual: { ...user.manual, ...patch } }
      : user,
  )

  write(keys.users, users)
  addActivity({ type: "manual_updated", actorId: userId })
}

export function addGoal(goal: Omit<Goal, "id" | "createdAt">): Goal {
  const goals = getGoals()
  const nextGoal: Goal = {
    ...goal,
    id: maxId(goals) + 1,
    createdAt: Date.now(),
  }

  write(keys.goals, [...goals, nextGoal])
  addActivity({
    type: "goal_created",
    actorId: goal.userId,
    goalId: nextGoal.id,
    talentId: goal.talentId,
  })

  return nextGoal
}

export function updateGoal(id: number, patch: Partial<Goal>) {
  const before = getGoals().find((goal) => goal.id === id)
  const goals = getGoals().map((goal) =>
    goal.id === id ? { ...goal, ...patch } : goal,
  )

  write(keys.goals, goals)

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

export function deleteGoal(id: number) {
  write(
    keys.goals,
    getGoals().filter((goal) => goal.id !== id),
  )
}

export function requestApproval(goalId: number, approverIds: string[]) {
  updateGoal(goalId, { approvalRequests: approverIds })
}

export function approveGoal(goalId: number, approverId: string) {
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

  write(keys.goals, goals)
  addActivity({
    type: "goal_approved",
    actorId: approverId,
    targetId: before.userId,
    goalId,
    talentId: before.talentId,
  })
}

export function sendKudos(kudos: Omit<Kudos, "id" | "createdAt">) {
  const current = getKudos()
  const next: Kudos = {
    ...kudos,
    id: maxId(current) + 1,
    createdAt: Date.now(),
  }

  write(keys.kudos, [next, ...current])
  addActivity({
    type: "kudos_sent",
    actorId: kudos.fromId,
    targetId: kudos.toId,
    talentId: kudos.talentId,
    message: kudos.message,
  })
}

export function markNotificationsRead() {
  write(keys.notificationsReadAt, Date.now())
}

export function useEnsureSeed() {
  useEffect(() => {
    ensureSeed()
  }, [])
}

export function useUsers() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<User[]>(keys.users, seed.users),
    () => seed.users,
  )
}

export function useTalents() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<Talent[]>(keys.talents, seed.talents),
    () => seed.talents,
  )
}

export function useGoals() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<Goal[]>(keys.goals, seed.goals),
    () => seed.goals,
  )
}

export function useActivity() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<ActivityEvent[]>(keys.activity, seed.activity),
    () => seed.activity,
  )
}

export function useKudos() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<Kudos[]>(keys.kudos, seed.kudos),
    () => seed.kudos,
  )
}

export function useCurrentUserId() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<string | null>(keys.currentUserId, null),
    () => null,
  )
}

export function useNotificationsReadAt() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<number>(keys.notificationsReadAt, 0),
    () => 0,
  )
}

export function useAppTheme() {
  return useSyncExternalStore(
    subscribe,
    () => cachedRead<"light" | "dark">(keys.theme, "light"),
    () => "light",
  )
}

export function useCurrentUser(): User | null {
  const currentUserId = useCurrentUserId()
  const users = useUsers()

  if (!currentUserId) return null

  return users.find((user) => user.id === currentUserId) ?? null
}

if (isBrowser()) {
  window.addEventListener("storage", emit)
}
