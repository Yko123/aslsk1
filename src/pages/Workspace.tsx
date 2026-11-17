import { useMemo, useRef, useState, type CSSProperties } from "react";

import OwnerBadge from "../components/OwnerBadge.tsx";
import { isBuilt, runPipeline, type StepState } from "../automation/runner.ts";
import { implementations } from "../automation/steps.ts";
import { load, save } from "../lib/storage.ts";
import type { InputField } from "../project-types.ts";
import { project } from "../project.ts";

const stepIds = project.steps.map((s) => s.id);
const samples = Object.fromEntries(project.inputs.map((f) => [f.id, f.sample]));
const empty = Object.fromEntries(project.inputs.map((f) => [f.id, ""]));

const statusText: Record<StepState["status"], string> = {
  waiting: "Waiting",
  running: "Running…",
  done: "Done",
  todo: "Not built yet",
  error: "Problem",
  skipped: "Skipped",
};

export default function Workspace() {
  const [values, setValues] = useState<Record<string, string>>(() => ({ ...samples, ...load("inputs", {}) }));
  const [states, setStates] = useState<Record<string, StepState>>({});
  const [running, setRunning] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const built = useMemo(() => stepIds.filter((id) => isBuilt(implementations[id])).length, []);
  const pct = Math.round((built / stepIds.length) * 100);

  const update = (next: Record<string, string>) => {
    setValues(next);
    save("inputs", next);
  };

  const run = async () => {
    setRunning(true);
    setStates({});
    if (window.matchMedia("(max-width: 900px)").matches) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    await runPipeline(stepIds, implementations, values, (id, state) => setStates((s) => ({ ...s, [id]: state })), {
      pauseMs: 320,
    });
    setRunning(false);
  };

  return (
    <section className="section container workspace">
      <header className="ws-head">
        <div>
          <p className="eyebrow rise">Workspace</p>
          <h1 className="page-title rise" style={{ animationDelay: "80ms" }}>
            Run the automation
          </h1>
          <p className="lede rise" style={{ animationDelay: "160ms" }}>
            Fill in the fields (or keep the sample), then run. Each step lights up as it finishes.
          </p>
        </div>
        <div
          className="progress-ring rise"
          style={{ "--pct": pct, animationDelay: "220ms" } as CSSProperties}
          role="img"
          aria-label={`${built} of ${stepIds.length} steps built`}
        >
          <span className="progress-value">
            {built}/{stepIds.length}
          </span>
          <span className="progress-label">steps built</span>
        </div>
      </header>

      <div className="ws-grid">
        <form
          className="card ws-inputs"
          onSubmit={(e) => {
            e.preventDefault();
            if (!running) void run();
          }}
        >
          <h2 className="card-title">Inputs</h2>
          {project.inputs.map((field) => (
            <Field key={field.id} field={field} value={values[field.id] ?? ""} onChange={(v) => update({ ...values, [field.id]: v })} />
          ))}
          <div className="ws-actions">
            <button type="submit" className="btn btn-primary" disabled={running}>
              {running ? "Running…" : "Run automation"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => update({ ...samples })} disabled={running}>
              Load sample
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => update({ ...empty })} disabled={running}>
              Clear
            </button>
          </div>
          <p className="muted small">Saved in this browser only. Nothing is sent anywhere.</p>
        </form>

        <div className="ws-steps" ref={resultsRef} aria-live="polite">
          <h2 className="card-title">Steps</h2>
          <ol className="step-list">
            {project.steps.map((step, i) => {
              const state = states[step.id];
              const built = isBuilt(implementations[step.id]);
              const status: string = state?.status ?? (built ? "waiting" : "todo-idle");
              return (
                <li key={step.id} className={`step step-${status}`}>
                  <span className="step-dot" aria-hidden="true">
                    {status === "done" ? "✓" : status === "error" ? "!" : i + 1}
                  </span>
                  <div className="step-body">
                    <div className="step-head">
                      <h3>{step.title}</h3>
                      <OwnerBadge by={step.by} />
                      <span className="step-status">
                        {state ? statusText[state.status] : built ? "Ready" : "Not built yet"}
                      </span>
                    </div>
                    <p className="step-detail">{step.detail}</p>
                    <StepResult state={state} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Field({ field, value, onChange }: { field: InputField; value: string; onChange: (v: string) => void }) {
  const id = `in-${field.id}`;
  const common = { id, value, placeholder: field.placeholder, required: !field.optional };
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {field.label}
        {field.optional && <span className="muted"> (optional)</span>}
      </span>
      {field.kind === "textarea" ? (
        <textarea {...common} rows={field.rows ?? 6} onChange={(e) => onChange(e.target.value)} spellCheck />
      ) : field.kind === "select" ? (
        <select {...common} onChange={(e) => onChange(e.target.value)}>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={field.kind} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.help && <span className="field-help">{field.help}</span>}
    </label>
  );
}

function StepResult({ state }: { state: StepState | undefined }) {
  if (!state) return null;
  if (state.status === "done")
    return (
      <div className="step-out">
        <p>
          {state.output.summary} <span className="muted small">({state.ms} ms)</span>
        </p>
        {state.output.data !== undefined && (
          <details>
            <summary>Show data</summary>
            <pre>{JSON.stringify(state.output.data, null, 2)}</pre>
          </details>
        )}
      </div>
    );
  if (state.status === "todo")
    return (
      <div className="step-out step-todo-box">
        <p>
          <strong>Your turn.</strong> {state.hint}
        </p>
        <p className="muted small">
          Build it in <code>src/automation/steps.ts</code>.
        </p>
      </div>
    );
  if (state.status === "error")
    return (
      <div className="step-out step-error-box" role="alert">
        <p>{state.message}</p>
      </div>
    );
  return null;
}
