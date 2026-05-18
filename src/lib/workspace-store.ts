import { createSeedState } from "../data/seed";
import { readStorage, writeStorage } from "./storage";

export const seed = createSeedState();

const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

export const readWorkspaceSnapshot = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  const raw = localStorage.getItem(key);
  const cached = snapshotCache.get(key);

  if (cached && cached.raw === raw) return cached.value as T;

  const value = readStorage<T>(key, fallback);
  snapshotCache.set(key, { raw, value });
  return value;
};

export const writeWorkspaceStorage = (key: string, value: unknown) => {
  snapshotCache.clear();
  writeStorage(key, value);
};

export const maxId = (items: { id: number }[]) =>
  items.reduce((max, item) => Math.max(max, item.id), 0);
