/**
 * The automation, one function per step. Each key is a step id from
 * src/project.ts, and the workspace runs them in that order.
 *
 * A step receives { inputs, results } and returns { summary, data }:
 *   - inputs: what the visitor typed, by input id;
 *   - results: the output of every step that already ran, by step id
 *     (for example results.read.data);
 *   - summary: one plain-English line the workspace shows;
 *   - data: anything the next steps need.
 * Throw an Error with a plain-English message when something is wrong.
 *
 * notBuilt("...") marks a step nobody has built yet: the workspace shows its
 * hint as "Your turn". Build one step at a time. Put the logic in its own file
 * under src/lib/ with a test, import it here, and replace the notBuilt line.
 */
import { readInputs } from "./read-inputs.ts";
import { notBuilt, type StepFn } from "./runner.ts";

export const implementations: Record<string, StepFn> = {
  // Read the inputs (code): already built, and the pattern to copy.
  read: readInputs,

  // Find the rules (code)
  retrieve: notBuilt("Write src/lib/sections.ts and src/lib/retrieve.ts (with tests). Use BM25: a keyword search that ranks sections by how often the question's words appear in them. Start with the made-up rules in src/data/samples/rules/."),

  // Teach and set a scenario (ai)
  teach: notBuilt("Send only the retrieved sections with their numbers. Rules: cite every rule, never use one not given, say when the sections do not cover it. Roll dice in src/lib/dice.ts."),

  // Rule on the move (ai)
  answer: notBuilt("Send the move and the retrieved sections. Ask for a fixed format: legal or illegal, cost per hex, rule numbers, one sentence of feedback."),

  // Check the ruling (code)
  verify: notBuilt("Write src/lib/check-citations.ts and src/lib/costs.ts (with tests). Flag invented rule numbers and words like \"bypass\"."),

  // Move to the next concept (code)
  progress: notBuilt("Save passed concepts per stage in the browser with src/lib/storage.ts."),
};
