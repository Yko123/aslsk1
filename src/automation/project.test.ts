// Guards for src/project.ts and src/automation/steps.ts: they must agree.
import { describe, expect, it } from "vitest";

import { project } from "../project.ts";
import { readInputs } from "./read-inputs.ts";
import { implementations } from "./steps.ts";

describe("project setup", () => {
  it("has a function for every step and no extra ones", () => {
    const ids = project.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.keys(implementations).sort()).toEqual([...ids].sort());
  });

  it("has unique input ids with a sample each", () => {
    const ids = project.inputs.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const field of project.inputs) expect(field.sample.trim(), field.id).not.toBe("");
  });

  it("reads the samples and refuses an empty required field", async () => {
    const samples = Object.fromEntries(project.inputs.map((f) => [f.id, f.sample]));
    const out = await readInputs({ inputs: samples, results: {} });
    expect(out.data).toBeTruthy();
    const required = project.inputs.find((f) => !f.optional);
    if (required) {
      expect(() => readInputs({ inputs: { ...samples, [required.id]: "  " }, results: {} })).toThrow(required.label);
    }
  });
});
