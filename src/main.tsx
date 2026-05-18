import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/main.css";
import App from "@/app/App";
import { ensureWorkspaceSeed } from "@/lib/test-data";
import { applyThemeFromStorage } from "@/theme/theme-storage";

ensureWorkspaceSeed();
applyThemeFromStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
