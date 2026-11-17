import { useEffect, useState } from "react";

import { load, save } from "../lib/storage.ts";

type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  teach: string[];
  scenario: string;
  question: string;
  choices: string[];
  answer: number;
  feedback: string;
};

// Introductory draft content: verify each lesson against ASLSK #1 before treating it as authoritative.
const lessons: Lesson[] = [
  {
    id: "movement",
    title: "Movement",
    subtitle: "Get your units where they need to be",
    teach: [
      "Infantry moves across the hex grid during its movement opportunity. A unit's Movement Factors (MF) are its movement budget for that move.",
      "The terrain entered and the route taken determine how much of that budget is spent. Plan the whole path and keep track of the cost as you go.",
    ],
    scenario: "A squad has a limited MF allowance. Its planned path crosses several hexes, including terrain that costs more to enter.",
    question: "What should you check before deciding whether the squad can finish the path?",
    choices: ["Add the MF cost of each part of the route and compare it with the allowance", "Count only the number of hexes", "Ignore terrain if the squad ends adjacent to an enemy"],
    answer: 0,
    feedback: "Movement is budgeted in MF. Track the costs along the route and compare the total with the unit's allowance.",
  },
  {
    id: "fire",
    title: "Fire",
    subtitle: "Resolve attacks using the right information",
    teach: [
      "Fire is resolved in stages of play. Before resolving an attack, identify the firing unit, its target, and the applicable attack information.",
      "A useful ruling needs the relevant table or rule and the dice result. A tutor should show the information needed for a calculation instead of asking you to guess it.",
    ],
    scenario: "A unit attacks a visible enemy. The scenario should tell you which attack value and table column apply, along with the dice result.",
    question: "Which set of information makes this attack question answerable?",
    choices: ["The target's name only", "The attack details needed for the table and the dice result", "A description of the board color"],
    answer: 1,
    feedback: "To work through an attack, you need the relevant attack information, the applicable table guidance, and the dice result.",
  },
  {
    id: "rout",
    title: "Rout",
    subtitle: "Understand what happens to affected units",
    teach: [
      "Rout is a later part of the sequence that deals with units required to withdraw after combat results. It follows the earlier movement and fire concepts in this learning path.",
      "The exact conditions, destination choices, and restrictions depend on the Starter Kit rules. Work through those conditions in order before deciding whether a route is allowed.",
    ],
    scenario: "After combat, a unit is subject to a rout decision. The situation must include the unit's status, nearby units, and the terrain relevant to its route.",
    question: "What is the soundest first step when evaluating a rout situation?",
    choices: ["Check the unit's status and apply the rout conditions in rule order", "Move it to any hex immediately", "Skip the decision if it is inconvenient"],
    answer: 0,
    feedback: "Start with the unit's status, then apply the required conditions and route restrictions in order.",
  },
];

const initialProgress = load("tutor-progress", { passed: [] as string[] });

export default function Tutor() {
  const [passed, setPassed] = useState<string[]>(initialProgress.passed);
  const [active, setActive] = useState(() => {
    const next = lessons.find((lesson) => !initialProgress.passed.includes(lesson.id));
    return next?.id ?? lessons[0].id;
  });
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => save("tutor-progress", { passed }), [passed]);

  const lesson = lessons.find((item) => item.id === active) ?? lessons[0];
  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
  const unlocked = (id: string) => lessons.findIndex((item) => item.id === id) === 0 || passed.includes(lessons[lessons.findIndex((item) => item.id === id) - 1]?.id ?? "");
  const isCorrect = choice === lesson.answer;
  const advance = () => {
    if (!isCorrect) return;
    const nextPassed = passed.includes(lesson.id) ? passed : [...passed, lesson.id];
    setPassed(nextPassed);
    const next = lessons[lessonIndex + 1];
    if (next) setActive(next.id);
    setChoice(null);
    setChecked(false);
  };

  return (
    <section className="section container tutor-page">
      <header className="tutor-header">
        <div>
          <p className="eyebrow">ASLSK learning path · in order</p>
          <h1 className="page-title">Learn the turn, one concept at a time.</h1>
          <p className="lede">Read a short lesson, try a scenario, and pass the check to unlock the next stage.</p>
        </div>
        <div className="tutor-count" aria-label={`${passed.length} of ${lessons.length} lessons passed`}>
          <strong>{passed.length}/{lessons.length}</strong><span>passed</span>
        </div>
      </header>

      <aside className="tutor-source" role="note">
        <strong>Draft lesson content.</strong> The attached 2007 book is the full ASL rulebook, not ASLSK #1. These explanations are a prototype and need exact ASLSK #1 rule references before they can be treated as authoritative. No full-ASL-only rules are used here.
      </aside>

      <div className="tutor-layout">
        <nav className="tutor-steps" aria-label="Lessons in order">
          {lessons.map((item, index) => {
            const available = unlocked(item.id);
            return (
              <button key={item.id} className={`tutor-step ${active === item.id ? "selected" : ""}`} disabled={!available} onClick={() => { setActive(item.id); setChoice(null); setChecked(false); }}>
                <span className="tutor-step-number">{passed.includes(item.id) ? "✓" : `0${index + 1}`}</span>
                <span><strong>{item.title}</strong><small>{available ? item.subtitle : "Pass the previous lesson to unlock"}</small></span>
                {!available && <span aria-label="Locked">🔒</span>}
              </button>
            );
          })}
          <button className="btn btn-ghost tutor-reset" onClick={() => { setPassed([]); setActive(lessons[0].id); setChoice(null); setChecked(false); }}>Reset progress</button>
        </nav>

        <article className="card tutor-card">
          <div className="tutor-card-head">
            <div><p className="eyebrow">Lesson {lessonIndex + 1} of {lessons.length}</p><h2>{lesson.title}</h2><p>{lesson.subtitle}</p></div>
            {passed.includes(lesson.id) && <span className="tutor-passed">Passed</span>}
          </div>
          <section className="tutor-teach" aria-labelledby="teach-heading">
            <h3 id="teach-heading">The idea</h3>
            {lesson.teach.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="tutor-scenario" aria-labelledby="scenario-heading">
            <p className="eyebrow" id="scenario-heading">Try this situation</p><p>{lesson.scenario}</p>
          </section>
          <fieldset className="tutor-question">
            <legend>{lesson.question}</legend>
            {lesson.choices.map((item, index) => (
              <label key={item} className={`tutor-choice ${choice === index ? "chosen" : ""} ${checked && index === lesson.answer ? "correct" : ""}`}>
                <input type="radio" name={`answer-${lesson.id}`} checked={choice === index} onChange={() => { setChoice(index); setChecked(false); }} />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          {checked && <div className={`tutor-feedback ${isCorrect ? "good" : "retry"}`} role="status"><strong>{isCorrect ? "That's right." : "Not quite yet."}</strong><p>{isCorrect ? lesson.feedback : "Review the idea above, then choose again. The next lesson stays locked until you get this check right."}</p></div>}
          <div className="tutor-actions">
            {!checked ? <button className="btn btn-primary" disabled={choice === null} onClick={() => setChecked(true)}>Check answer</button> : isCorrect ? <button className="btn btn-primary" onClick={advance}>{lessonIndex === lessons.length - 1 ? "Finish learning path" : "Pass & continue"} <span aria-hidden="true">→</span></button> : <button className="btn btn-ghost" onClick={() => { setChoice(null); setChecked(false); }}>Try again</button>}
            <span className="muted small">Progress saves in this browser.</span>
          </div>
          {passed.length === lessons.length && <p className="tutor-complete">Learning path complete. You can revisit any lesson from the list.</p>}
        </article>
      </div>
    </section>
  );
}
