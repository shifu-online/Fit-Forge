import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", textAlign: "center" }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "var(--color-error)",
        }}
      >
        404 - Page Not Found
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginTop: "16px",
          fontSize: "1rem",
        }}
      >
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="btn btn--primary"
        style={{ marginTop: "24px", padding: "12px 24px" }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
