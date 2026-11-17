/**
 * Runs the automation: each step in order, one after another. A step gets the
 * inputs and every earlier step's output, and returns its own output. The run
 * stops at the first step that is not built yet or fails, and the later steps
 * are marked "skipped". Nothing here touches the page; the workspace listens
 * through onUpdate.
 */

export interface StepOutput {
  /** One line for the person using the site. */
  summary: string;
  /** Anything the next steps need. The workspace shows it as JSON. */
  data?: unknown;
}

export interface StepContext {
  inputs: Readonly<Record<string, string>>;
  /** Outputs of the steps that already ran, by step id. */
  results: Readonly<Record<string, StepOutput>>;
}

export type StepFn = (ctx: StepContext) => StepOutput | Promise<StepOutput>;

export type StepState =
  | { status: "waiting" }
  | { status: "running" }
  | { status: "done"; output: StepOutput; ms: number }
  | { status: "todo"; hint: string }
  | { status: "error"; message: string }
  | { status: "skipped" };

const NOT_BUILT = Symbol("notBuilt");

export class NotBuiltYet extends Error {
  constructor(readonly hint: string) {
    super(hint);
    this.name = "NotBuiltYet";
  }
}

/** A placeholder for a step nobody has built yet. The hint says what it should do. */
export function notBuilt(hint: string): StepFn {
  const fn: StepFn = () => {
    throw new NotBuiltYet(hint);
  };
  return Object.assign(fn, { [NOT_BUILT]: true });
}

export function isBuilt(fn: StepFn | undefined): boolean {
  return typeof fn === "function" && !(NOT_BUILT in fn);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runPipeline(
  stepIds: readonly string[],
  implementations: Readonly<Record<string, StepFn>>,
  inputs: Readonly<Record<string, string>>,
  onUpdate: (id: string, state: StepState) => void = () => {},
  options: { pauseMs?: number } = {},
): Promise<Record<string, StepState>> {
  const states: Record<string, StepState> = {};
  const results: Record<string, StepOutput> = {};
  const set = (id: string, state: StepState) => {
    states[id] = state;
    onUpdate(id, state);
  };
  stepIds.forEach((id) => set(id, { status: "waiting" }));

  let stopped = false;
  for (const id of stepIds) {
    if (stopped) {
      set(id, { status: "skipped" });
      continue;
    }
    set(id, { status: "running" });
    if (options.pauseMs) await sleep(options.pauseMs);
    const fn = implementations[id];
    const started = performance.now();
    try {
      if (!fn) throw new NotBuiltYet(`There is no function for the step "${id}" in src/automation/steps.ts.`);
      const output = await fn({ inputs, results: { ...results } });
      results[id] = output;
      set(id, { status: "done", output, ms: Math.round(performance.now() - started) });
    } catch (err) {
      stopped = true;
      if (err instanceof NotBuiltYet) set(id, { status: "todo", hint: err.hint });
      else set(id, { status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }
  return states;
}
