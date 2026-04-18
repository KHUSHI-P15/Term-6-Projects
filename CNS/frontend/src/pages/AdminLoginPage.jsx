import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminAuthenticated } from "../utils/auth.js";
import { loginAdminRequest } from "../api/client.js";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginAdminRequest(form);
      setAdminAuthenticated(response.token);
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.message || "Invalid admin credentials.");
      setLoading(false);
    }
  };

  return (
    <section className="panel admin-login-panel fade-up">
      <p className="eyebrow">Admin Access</p>
      <h2>Phishing Simulation Control Panel</h2>
      <p className="muted-text">
        Authorized access only. This panel is restricted to simulation coordinators.
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="admin-username">Admin Username</label>
        <input
          id="admin-username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="admin@vti.edu"
          required
        />

        <label htmlFor="admin-password">Admin Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter admin password"
          required
        />

        {error ? <p className="error-text">{error}</p> : null}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Admin Sign In"}
        </button>
      </form>
    </section>
  );
}

export default AdminLoginPage;
