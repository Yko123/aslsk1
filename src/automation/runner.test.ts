import { describe, expect, it } from "vitest";

import { isBuilt, notBuilt, runPipeline, type StepFn } from "./runner.ts";

const ok = (summary: string): StepFn => () => ({ summary });

describe("runPipeline", () => {
  it("runs every step in order and passes earlier results forward", async () => {
    const seen: string[] = [];
    const states = await runPipeline(
      ["a", "b"],
      {
        a: () => ({ summary: "first", data: 2 }),
        b: ({ results }) => {
          seen.push(String(results.a?.data));
          return { summary: "second" };
        },
      },
      {},
    );
    expect(states.a.status).toBe("done");
    expect(states.b.status).toBe("done");
    expect(seen).toEqual(["2"]);
  });

  it("stops at a step that is not built and skips the rest", async () => {
    const states = await runPipeline(["a", "b", "c"], { a: ok("x"), b: notBuilt("do it"), c: ok("y") }, {});
    expect(states.b).toEqual({ status: "todo", hint: "do it" });
    expect(states.c.status).toBe("skipped");
  });

  it("reports a thrown error as the step's message", async () => {
    const boom: StepFn = () => {
      throw new Error("Fill in the schedule first.");
    };
    const states = await runPipeline(["a", "b"], { a: boom, b: ok("y") }, {});
    expect(states.a).toEqual({ status: "error", message: "Fill in the schedule first." });
    expect(states.b.status).toBe("skipped");
  });

  it("treats a missing function as not built", async () => {
    const states = await runPipeline(["ghost"], {}, {});
    expect(states.ghost.status).toBe("todo");
  });
});

describe("isBuilt", () => {
  it("tells placeholders from real steps", () => {
    expect(isBuilt(notBuilt("later"))).toBe(false);
    expect(isBuilt(ok("now"))).toBe(true);
    expect(isBuilt(undefined)).toBe(false);
  });
});
