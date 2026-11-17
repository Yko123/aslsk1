import { Link } from "react-router-dom";

import { project } from "../project.ts";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name">{project.name}</p>
          <p className="muted">{project.tagline}</p>
        </div>
        <div className="footer-meta">
          <p>
            <Link to="/about">About this project</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
