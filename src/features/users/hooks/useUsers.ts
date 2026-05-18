import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants/storageKeys";
import type { Manual, Talent, User } from "@/types/talents";
import { readStorage, subscribeStorage } from "@/lib/storage";
import { addActivity } from "@/features/activity/hooks/useActivity";
import {
  readWorkspaceSnapshot,
  seed,
  writeWorkspaceStorage,
} from "@/lib/workspace-store";

const emptyUsers: User[] = [];
const emptyTalents: Talent[] = [];

export const getUsers = () =>
  readStorage<User[]>(STORAGE_KEYS.users, seed.users);

export const getTalents = () =>
  readStorage<Talent[]>(STORAGE_KEYS.talents, seed.talents);

export const replaceUsers = (users: User[]) => {
  writeWorkspaceStorage(STORAGE_KEYS.users, users);
};

export const updateUser = (id: string, patch: Partial<User>) => {
  const users = getUsers();
  const before = users.find((user) => user.id === id);
  const next = users.map((user) =>
    user.id === id ? { ...user, ...patch } : user,
  );

  writeWorkspaceStorage(STORAGE_KEYS.users, next);

  if (before && !before.role && patch.role) {
    addActivity({ type: "joined", actorId: id });
  }
};

export const updateManual = (userId: string, patch: Partial<Manual>) => {
  const users = getUsers().map((user) =>
    user.id === userId
      ? { ...user, manual: { ...user.manual, ...patch } }
      : user,
  );

  writeWorkspaceStorage(STORAGE_KEYS.users, users);
  addActivity({ type: "manual_updated", actorId: userId });
};

export const useUsers = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readWorkspaceSnapshot<User[]>(STORAGE_KEYS.users, seed.users),
    () => emptyUsers,
  );

export const useTalents = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readWorkspaceSnapshot<Talent[]>(STORAGE_KEYS.talents, seed.talents),
    () => emptyTalents,
  );
