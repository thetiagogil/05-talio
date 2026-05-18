import App from "@/app/App";
import { ensureWorkspaceSeed } from "@/lib/test-data";
import "@/main.css";
import { applyThemeFromStorage } from "@/theme/theme-storage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

ensureWorkspaceSeed();
applyThemeFromStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
