/** The shape of src/project.ts. Every page reads its words from there. */

/** The four looks a site can have. Each sets its own fonts, colors and background (styles/tokens.css). */
export type ThemeName = "midnight" | "paper" | "neon" | "pastel";

export interface InputField {
  id: string;
  label: string;
  kind: "text" | "textarea" | "select" | "number" | "time" | "date";
  /** Made-up example the "Load sample" button fills in. Never real personal data. */
  sample: string;
  placeholder?: string;
  help?: string;
  /** For kind "select". */
  options?: string[];
  rows?: number;
  /** Optional fields may be left empty when the automation runs. */
  optional?: boolean;
}

/** Who does the step: plain code, an AI model, or the person using the site. */
export type StepOwner = "code" | "ai" | "you";

export interface StepInfo {
  /** Matches a key in src/automation/steps.ts. */
  id: string;
  title: string;
  detail: string;
  by: StepOwner;
}

export interface Project {
  name: string;
  /** Two or three characters for the logo mark. */
  mark: string;
  tagline: string;
  summary: string;
  team: string[];
  theme: ThemeName;
  /** Accent color as a hue angle, 0-360 (0 red, 120 green, 220 blue). */
  hue: number;
  problem: { headline: string; points: string[] };
  features: { title: string; text: string }[];
  dataSource: string;
  inputs: InputField[];
  steps: StepInfo[];
  outOfScope: string[];
}
