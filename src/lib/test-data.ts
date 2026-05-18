import { createSeedState } from "../data/seed";
import { STORAGE_KEYS } from "@/lib/constants/storageKeys";
import type { ActivityEvent, Goal, Kudos, Talent, User } from "@/types/talents";
import { readStorage, writeStorage } from "@/lib/storage";

export const ensureWorkspaceSeed = () => {
  const seed = createSeedState();

  if (readStorage<User[]>(STORAGE_KEYS.users, []).length === 0) {
    writeStorage(STORAGE_KEYS.users, seed.users);
  }

  if (readStorage<Talent[]>(STORAGE_KEYS.talents, []).length === 0) {
    writeStorage(STORAGE_KEYS.talents, seed.talents);
  }

  if (readStorage<Goal[]>(STORAGE_KEYS.goals, []).length === 0) {
    writeStorage(STORAGE_KEYS.goals, seed.goals);
  }

  if (readStorage<Kudos[]>(STORAGE_KEYS.kudos, []).length === 0) {
    writeStorage(STORAGE_KEYS.kudos, seed.kudos);
  }

  if (readStorage<ActivityEvent[]>(STORAGE_KEYS.activity, []).length === 0) {
    writeStorage(STORAGE_KEYS.activity, seed.activity);
  }
};
