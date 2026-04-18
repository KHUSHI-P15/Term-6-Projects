import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitPhishingForm } from "../api/client.js";

function FakeLoginPage() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await submitPhishingForm(formState);

      navigate("/result", {
        state: {
          username: formState.username,
          password: formState.password,
          warning: response.warning,
          submittedAt: response.payload.submittedAt
        }
      });
    } catch (apiError) {
      setError(apiError.message || "Unable to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="phish-layout fade-up">
      <aside className="trust-panel">
        <p className="eyebrow">Academic Verification Center</p>
        <h2>VTI Institute Portal</h2>
        <p className="muted-text">
          Verify credentials to continue services and access core academic modules.
        </p>

        <div className="compliance-strip">
          <span>Academic Awareness Project</span>
          <span>Classroom Evaluation Scenario</span>
        </div>

        <div className="notice-list">
          <article className="notice-item">
            <h4>Your student access expires today</h4>
            <p>Important notice from administration: complete verification to avoid interruption.</p>
          </article>
          <article className="notice-item">
            <h4>Re-login required for semester services</h4>
            <p>Verify credentials to continue services for results, attendance, and registration.</p>
          </article>
        </div>
      </aside>

      <section className="panel login-panel">
        <p className="login-badge">Student Service Login</p>
        <h3 className="login-title">Account Verification</h3>
        <p className="muted-text">Enter your institutional account details to proceed.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="22CSE001"
            value={formState.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter portal password"
            value={formState.password}
            onChange={handleChange}
            required
          />

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </section>
    </section>
  );
}

export default FakeLoginPage;
