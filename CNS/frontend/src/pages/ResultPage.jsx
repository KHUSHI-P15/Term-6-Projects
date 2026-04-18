import { Link, useLocation } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const result = location.state;

  return (
    <section className="panel alert-panel fade-up">
      <p className="eyebrow danger">Simulation Outcome</p>
      <h2>This was a phishing simulation</h2>
      <p>
        You trusted a familiar-looking portal. Attackers use urgency, branding,
        and fake login interfaces to collect credentials. In real phishing attacks,
        these details can be captured and misused.
      </p>

      <div className="warning-box">
        <p>
          <strong>Username Entered:</strong> {result?.username || "Not available"}
        </p>
        <p>
          <strong>Password Entered:</strong> {result?.password || "Not available"}
        </p>
        <p>
          <strong>Submission Time:</strong> {result?.submittedAt || "Not available"}
        </p>
        <p>
          <strong>Key Observation:</strong>{" "}
          {result?.warning || "Always verify URLs before entering credentials."}
        </p>
      </div>

      <div className="button-row">
        <Link to="/fake-login" className="btn btn-outline">
          Try Again
        </Link>
        <Link to="/security-tips" className="btn btn-primary">
          Detection Guide
        </Link>
        <Link to="/admin-login" className="btn btn-outline">
          Admin Login
        </Link>
      </div>
    </section>
  );
}

export default ResultPage;
