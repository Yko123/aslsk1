import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { project } from "../project.ts";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/workspace", label: "Tutor", end: false },
  { to: "/about", label: "About", end: false },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""} ${open ? "nav-open" : ""}`}>
      <div className="nav-inner">
        <NavLink to="/" className="brand" aria-label={`${project.name} home`}>
          <span className="brand-mark">{project.mark}</span>
          <span className="brand-name">{project.name}</span>
        </NavLink>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
        <nav id="nav-links" className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="nav-link">
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/workspace" className="btn btn-primary btn-small nav-cta">
            Start learning
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
