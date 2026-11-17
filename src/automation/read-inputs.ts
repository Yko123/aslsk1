/**
 * Step 1 of every site, already built: check that the required fields are
 * filled in and hand the cleaned-up text to the next steps. It is the pattern
 * for every other step: take the context, return { summary, data }, throw an
 * Error with a plain-English message when something is wrong.
 */
import { project } from "../project.ts";
import type { StepFn } from "./runner.ts";

export const readInputs: StepFn = ({ inputs }) => {
  const cleaned: Record<string, string> = {};
  for (const field of project.inputs) {
    const value = (inputs[field.id] ?? "").trim();
    if (!value && !field.optional) throw new Error(`Fill in "${field.label}" first.`);
    cleaned[field.id] = value;
  }
  const text = Object.values(cleaned).join("\n");
  const lines = text ? text.split("\n").filter((line) => line.trim()).length : 0;
  return {
    summary: `Read ${project.inputs.length} fields: ${text.length.toLocaleString("en-US")} characters on ${lines} lines.`,
    data: cleaned,
  };
};
