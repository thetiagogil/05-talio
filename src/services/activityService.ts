import { useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "../lib/constants/storageKeys"
import type { ActivityEvent } from "../types/talents"
import { readStorage, subscribeStorage } from "./storageService"
import {
  maxId,
  readWorkspaceSnapshot,
  seed,
  writeWorkspaceStorage,
} from "./workspaceStore"

const emptyActivity: ActivityEvent[] = []

export const getActivity = () =>
  readStorage<ActivityEvent[]>(STORAGE_KEYS.activity, seed.activity)

export const addActivity = (
  event: Omit<ActivityEvent, "id" | "createdAt"> & { createdAt?: number },
) => {
  const activity = getActivity()
  const next: ActivityEvent = {
    id: maxId(activity) + 1,
    createdAt: Date.now(),
    ...event,
  }

  writeWorkspaceStorage(STORAGE_KEYS.activity, [next, ...activity])
}

export const useActivity = () =>
  useSyncExternalStore(
    subscribeStorage,
    () =>
      readWorkspaceSnapshot<ActivityEvent[]>(
        STORAGE_KEYS.activity,
        seed.activity,
      ),
    () => emptyActivity,
  )
