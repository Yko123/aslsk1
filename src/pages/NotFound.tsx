import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section container narrow center">
      <p className="eyebrow">404</p>
      <h1 className="page-title">This page doesn't exist.</h1>
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
    </section>
  );
}
