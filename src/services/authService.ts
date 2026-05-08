import { useSyncExternalStore } from "react";
import { TEST_USER } from "../lib/constants/testUser";
import { STORAGE_KEYS } from "../lib/constants/storageKeys";
import type { User } from "../types/talents";
import { ensureWorkspaceSeed } from "./testDataService";
import {
  readStorage,
  removeStorage,
  subscribeStorage,
  writeStorage,
} from "./storageService";

const emptySession = "";

const getUsers = () => readStorage<User[]>(STORAGE_KEYS.users, []);

const getSessionUserId = () =>
  readStorage<string | null>(STORAGE_KEYS.session, null) ?? emptySession;

const ensureTestUser = () => {
  const users = getUsers();
  const existingUser = users.find((user) => user.id === TEST_USER.id);

  if (existingUser) return existingUser;

  writeStorage(STORAGE_KEYS.users, [...users, TEST_USER]);
  return TEST_USER;
};

export const getCurrentUser = (): User | null => {
  const userId = readStorage<string | null>(STORAGE_KEYS.session, null);
  if (!userId) return null;

  return getUsers().find((user) => user.id === userId) ?? null;
};

export const loginByEmail = (email: string): User | null => {
  ensureWorkspaceSeed();

  const user = getUsers().find(
    (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!user) return null;

  writeStorage(STORAGE_KEYS.session, user.id);
  return user;
};

export const continueWithTestUser = () => {
  ensureWorkspaceSeed();
  const user = ensureTestUser();
  writeStorage(STORAGE_KEYS.session, user.id);
  return user;
};

export const logout = () => {
  removeStorage(STORAGE_KEYS.session);
};

export const useCurrentUserId = () =>
  useSyncExternalStore(subscribeStorage, getSessionUserId, () => emptySession);

export const useCurrentUser = () => {
  const session = useCurrentUserId();
  void session;
  return getCurrentUser();
};

export const useAuth = () => {
  const user = useCurrentUser();
  return {
    user,
    isAuthenticated: Boolean(user),
  };
};
