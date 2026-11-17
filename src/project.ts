/**
 * Everything the site says about this project: name, look, team, features,
 * the automation's inputs and steps. Edit the words here and every page
 * updates. Step ids must match the keys in src/automation/steps.ts.
 *
 * theme: "midnight" | "paper" | "neon" | "pastel"  ·  hue: 0-360 accent color
 */
import type { Project } from "./project-types.ts";

export const project: Project = {
  name: "Game Tutor",
  mark: "GT",
  theme: "neon",
  hue: 30,
  tagline: "Learn the Starter Kit in order.",
  summary: "A guided ASLSK learning path: read a short explanation, try a scenario, and pass a quick check before moving on.",
  team: [],
  problem: {
    headline: "Chatbots mix in rules from the full game.",
    points: [
      "Asked to tutor the Starter Kit, a chatbot used Bypass Movement, critical hits and sniper checks, which belong to the full rulebook.",
      "A new player cannot tell which rules are from the wrong book.",
      "It set a task without the fire table or dice roll the player needed to solve it.",
    ],
  },
  features: [
    {
      title: "Ordered lessons",
      text: "Work through Movement, Fire and Rout one step at a time.",
    },
    {
      title: "Check understanding",
      text: "Short scenario questions give immediate feedback and unlock lessons in sequence.",
    },
    {
      title: "Keep your place",
      text: "Lesson progress is saved in this browser so you can return later.",
    },
    {
      title: "Practice at your pace",
      text: "Progress stays in your browser, and you can reset the path any time.",
    },
  ],
  dataSource: "Prototype lesson text pending verification against the ASLSK #1 rulebook.",
  inputs: [
    {
      id: "stage",
      label: "Stage",
      kind: "select",
      options: ["Movement", "Fire", "Rout"],
      sample: "Movement",
    },
    {
      id: "question",
      label: "Question or move",
      kind: "textarea",
      rows: 3,
      sample: "My squad starts in open ground and moves into the woods hex next to it. How many movement factors does that cost?",
    },
  ],
  steps: [
    {
      id: "read",
      title: "Read the inputs",
      detail: "Check that the stage and the question are filled in and clean them up.",
      by: "code",
    },
    {
      id: "retrieve",
      title: "Find the rules",
      by: "code",
      detail: "Search the rulebook sections for this stage and return the top sections with their rule numbers.",
    },
    {
      id: "teach",
      title: "Teach and set a scenario",
      by: "ai",
      detail: "Explain the concept from the retrieved sections only, citing rule numbers, then set a small scenario. Code adds dice rolls and table rows.",
    },
    {
      id: "answer",
      title: "Rule on the move",
      by: "ai",
      detail: "Legal or illegal, the cost per hex, and the rule numbers used, from the retrieved sections only.",
    },
    {
      id: "verify",
      title: "Check the ruling",
      by: "code",
      detail: "Every cited rule number must be among the retrieved sections, no full-game terms may appear, and the costs must add up. Failures show as warnings.",
    },
    {
      id: "progress",
      title: "Move to the next concept",
      by: "code",
      detail: "Record a passed concept and open the next one only after a correct move.",
    },
  ],
  outOfScope: ["Rules from the full Advanced Squad Leader rulebook", "Playing a full game against you"],
};
