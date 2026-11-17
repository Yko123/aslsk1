import Reveal from "../components/Reveal.tsx";
import { project } from "../project.ts";

export default function About() {
  return (
    <section className="section container narrow">
      <p className="eyebrow rise">About</p>
      <h1 className="page-title rise" style={{ animationDelay: "80ms" }}>
        {project.name}
      </h1>
      <p className="lede rise" style={{ animationDelay: "160ms" }}>
        {project.summary}
      </p>

      <Reveal className="about-block">
        <h2>Where the data comes from</h2>
        <p>{project.dataSource}</p>
      </Reveal>

      <Reveal className="about-block">
        <h2>Not part of this project</h2>
        <ul className="bullets">
          {project.outOfScope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="about-block">
        <h2>Privacy</h2>
        <p>
          Everything you type stays in your own browser. The samples are made up. Do not paste other people's names,
          grades or messages into a public copy of this site.
        </p>
      </Reveal>

    </section>
  );
}
