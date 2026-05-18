import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants/storageKeys";
import { subscribeStorage } from "@/lib/storage";
import {
  readWorkspaceSnapshot,
  writeWorkspaceStorage,
} from "@/lib/workspace-store";

export const markNotificationsRead = () => {
  writeWorkspaceStorage(STORAGE_KEYS.notificationsReadAt, Date.now());
};

export const useNotificationsReadAt = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readWorkspaceSnapshot<number>(STORAGE_KEYS.notificationsReadAt, 0),
    () => 0,
  );
