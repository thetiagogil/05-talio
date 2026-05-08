import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./main.css";
import "./styles/index.css";
import App from "./App.tsx";
import { applyThemeFromStorage } from "./services/themeService";

applyThemeFromStorage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
