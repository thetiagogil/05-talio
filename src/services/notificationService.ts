import { useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "../lib/constants/storageKeys"
import { subscribeStorage } from "./storageService"
import { readWorkspaceSnapshot, writeWorkspaceStorage } from "./workspaceStore"

export const markNotificationsRead = () => {
  writeWorkspaceStorage(STORAGE_KEYS.notificationsReadAt, Date.now())
}

export const useNotificationsReadAt = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readWorkspaceSnapshot<number>(STORAGE_KEYS.notificationsReadAt, 0),
    () => 0,
  )
