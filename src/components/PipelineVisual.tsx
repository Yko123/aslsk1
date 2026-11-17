import type { CSSProperties } from "react";

import { project } from "../project.ts";
import OwnerBadge from "./OwnerBadge.tsx";

/** The hero's moving picture of the automation: a pulse travels down the steps and lights each one. */
export default function PipelineVisual() {
  const n = project.steps.length;
  return (
    <div className="pipe" style={{ "--n": n } as CSSProperties} aria-label="How the automation flows">
      <div className="pipe-rail" aria-hidden="true">
        <span className="pipe-pulse" />
      </div>
      <ol className="pipe-list">
        {project.steps.map((step, i) => (
          <li key={step.id} className="pipe-node" style={{ "--i": i } as CSSProperties}>
            <span className="pipe-dot" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="pipe-card">
              <span className="pipe-title">{step.title}</span>
              <OwnerBadge by={step.by} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
