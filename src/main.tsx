import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { project } from "./project.ts";
import "./styles/tokens.css";
import "./styles/global.css";

// The theme and accent come from src/project.ts; tokens.css turns them into colors and fonts.
document.documentElement.dataset.theme = project.theme;
document.documentElement.style.setProperty("--hue", String(project.hue));
document.title = `${project.name} · ${project.tagline}`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
