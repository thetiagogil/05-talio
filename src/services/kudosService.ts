import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "../lib/constants/storageKeys";
import type { Kudos } from "../types/talents";
import { readStorage, subscribeStorage } from "./storageService";
import { addActivity } from "./activityService";
import {
  maxId,
  readWorkspaceSnapshot,
  seed,
  writeWorkspaceStorage,
} from "./workspaceStore";

const emptyKudos: Kudos[] = [];

export const getKudos = () =>
  readStorage<Kudos[]>(STORAGE_KEYS.kudos, seed.kudos);

export const sendKudos = (kudos: Omit<Kudos, "id" | "createdAt">) => {
  const current = getKudos();
  const next: Kudos = {
    ...kudos,
    id: maxId(current) + 1,
    createdAt: Date.now(),
  };

  writeWorkspaceStorage(STORAGE_KEYS.kudos, [next, ...current]);
  addActivity({
    type: "kudos_sent",
    actorId: kudos.fromId,
    targetId: kudos.toId,
    talentId: kudos.talentId,
    message: kudos.message,
  });
};

export const useKudos = () =>
  useSyncExternalStore(
    subscribeStorage,
    () => readWorkspaceSnapshot<Kudos[]>(STORAGE_KEYS.kudos, seed.kudos),
    () => emptyKudos,
  );
