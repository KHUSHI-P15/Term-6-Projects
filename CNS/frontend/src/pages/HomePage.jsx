import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="panel hero-panel fade-up">
      <p className="eyebrow">CNS Practical Project</p>
      <h1>Create a Fake Website to Capture Credentials: Phishing Simulation</h1>
      <p>
        This ethical phishing awareness project demonstrates how attackers imitate
        trusted institutional portals to trick users into entering credentials.
        The simulation is intentionally designed for learning and prevention.
      </p>

      <div className="hero-grid">
        <article className="glass-card">
          <h3>Project Overview</h3>
          <p>
            You will interact with a fictional Student Service Login page designed
            to look familiar and urgent, similar to real-world phishing attempts.
          </p>
        </article>

        <article className="glass-card">
          <h3>Research Objective</h3>
          <p>
            This project evaluates credential submission behavior in a controlled
            academic simulation to strengthen phishing detection awareness.
          </p>
        </article>
      </div>

      <div className="button-row">
        <Link to="/fake-login" className="btn btn-primary">
          Launch Verification Scenario
        </Link>
        <Link to="/security-tips" className="btn btn-outline">
          Review Detection Guide
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
