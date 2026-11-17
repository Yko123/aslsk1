import { Link } from "react-router-dom";

import Reveal from "../components/Reveal.tsx";
import { project } from "../project.ts";

const stages = [
  { number: "01", title: "Movement", text: "Learn to think about a unit's movement budget and its route." },
  { number: "02", title: "Fire", text: "Practice reading an attack situation with the needed information provided." },
  { number: "03", title: "Rout", text: "Work through a later turn concept after passing the earlier lessons." },
];

export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow rise">ASL Starter Kit · guided practice</p>
          <h1 className="hero-title rise">{project.name}</h1>
          <p className="hero-tagline rise">{project.tagline}</p>
          <p className="hero-summary rise">{project.summary}</p>
          <div className="hero-actions rise">
            <Link to="/workspace" className="btn btn-primary">Start learning <span aria-hidden="true">→</span></Link>
            <a href="#path" className="btn btn-ghost">See the path</a>
          </div>
        </div>
        <div className="hero-visual rise" aria-hidden="true">
          <div className="card" style={{ padding: 28, display: "grid", gap: 14 }}>
            {stages.map((stage, index) => <div key={stage.number} className="chip" style={{ opacity: 1 - index * 0.16 }}><span className="muted">{stage.number}</span>　{stage.title}</div>)}
          </div>
        </div>
      </section>

      <section id="path" className="section container">
        <Reveal>
          <p className="eyebrow">The learning path</p>
          <h2 className="section-title">Three topics, in sequence.</h2>
          <p className="lede">Each lesson has a short explanation, a situation to think through, and a knowledge check. Pass it to open the next topic.</p>
        </Reveal>
        <div className="feature-grid">
          {stages.map((stage, index) => <Reveal as="article" key={stage.number} delay={index * 90} className="card feature">
            <span className="feature-num">{stage.number}</span><h3>{stage.title}</h3><p>{stage.text}</p>
          </Reveal>)}
        </div>
      </section>

      <section className="section container">
        <Reveal className="cta-band">
          <div><h2>Ready for the first lesson?</h2><p>Your progress is saved in this browser.</p></div>
          <Link to="/workspace" className="btn btn-primary">Start learning <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>
    </>
  );
}
