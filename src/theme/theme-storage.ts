import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants/storageKeys";
import { readStorage, subscribeStorage } from "@/lib/storage";
import {
  readWorkspaceSnapshot,
  writeWorkspaceStorage,
} from "@/lib/workspace-store";

export const getTheme = (): "light" | "dark" =>
  readStorage<"light" | "dark">(STORAGE_KEYS.theme, "light");

export const applyThemeFromStorage = () => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", getTheme() === "dark");
};

export const setTheme = (theme: "light" | "dark") => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  writeWorkspaceStorage(STORAGE_KEYS.theme, theme);
};

export const toggleTheme = () => {
  setTheme(getTheme() === "light" ? "dark" : "light");
};

export const useAppTheme = (): "light" | "dark" =>
  useSyncExternalStore(
    subscribeStorage,
    () => readWorkspaceSnapshot<"light" | "dark">(STORAGE_KEYS.theme, "light"),
    () => "light",
  );
