import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Legend,
  Pie,
  PieChart,
  Cell
} from "recharts";
import { fetchSimulationStats } from "../api/client.js";
import { logoutAdmin } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";

const formatTime = (isoTime) => {
  if (!isoTime) {
    return "No recent activity";
  }

  return new Date(isoTime).toLocaleString();
};

const PIE_COLORS = ["#28d6ff", "#4ef5b7"];

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    uniqueUsernames: 0,
    averagePasswordLength: 0,
    latestActivity: null,
    latestSubmissions: [],
    attemptsTrend: [],
    passwordLengthDistribution: [],
    userBehaviorBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const togglePassword = (rowId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin-login");
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchSimulationStats();
        setStats({
          totalSubmissions: response.totalSubmissions ?? 0,
          uniqueUsernames: response.uniqueUsernames ?? 0,
          averagePasswordLength: response.averagePasswordLength ?? 0,
          latestActivity: response.latestActivity || null,
          latestSubmissions: response.latestSubmissions ?? [],
          attemptsTrend: response.attemptsTrend ?? [],
          passwordLengthDistribution: response.passwordLengthDistribution ?? [],
          userBehaviorBreakdown: response.userBehaviorBreakdown ?? []
        });
      } catch (apiError) {
        if (
          String(apiError.message || "").toLowerCase().includes("token") ||
          String(apiError.message || "").toLowerCase().includes("unauthorized")
        ) {
          logoutAdmin();
          navigate("/admin-login", { replace: true });
          return;
        }

        setError(apiError.message || "Failed to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="panel fade-up">
        <h2>Credential Capture Analytics</h2>
        <p>Loading credential capture analytics...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel fade-up">
        <h2>Credential Capture Analytics</h2>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  return (
    <section className="panel fade-up">
      <div className="dashboard-head">
        <div>
          <p className="eyebrow">Submission Monitoring and Behavioral Insights</p>
          <h2>Phishing Simulation Analytics</h2>
        </div>
        <button type="button" className="btn btn-outline" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="compliance-strip">
        <span>Academic Security Research Context</span>
        <span>Data-Driven Phishing Awareness</span>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <p>Total Credential Submissions</p>
          <h3>{stats.totalSubmissions}</h3>
        </article>

        <article className="stat-card">
          <p>Unique Usernames</p>
          <h3>{stats.uniqueUsernames}</h3>
        </article>

        <article className="stat-card">
          <p>Latest Submission Time</p>
          <h3>{formatTime(stats.latestActivity)}</h3>
        </article>

        <article className="stat-card">
          <p>Average Password Length</p>
          <h3>{stats.averagePasswordLength}</h3>
        </article>
      </div>

      <div className="chart-grid">
        <article className="panel chart-panel">
          <h3>Credential Submissions Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.attemptsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="attempts" stroke="#28d6ff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article className="panel chart-panel">
          <h3>Password Length Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.passwordLengthDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4ef5b7" />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel chart-panel">
          <h3>Unique Users vs Repeat Attempts</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.userBehaviorBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={3}
              >
                {stats.userBehaviorBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </div>

      <h3 className="table-title">Credential Capture Analytics</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>Submitted At</th>
              <th>Password Length</th>
            </tr>
          </thead>
          <tbody>
            {stats.latestSubmissions.length > 0 ? (
              stats.latestSubmissions.map((row) => (
                <tr key={row.id}>
                  <td>{row.username}</td>
                  <td>
                    <div className="password-cell">
                      <span>{visiblePasswords[row.id] ? row.password : row.passwordMasked}</span>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => togglePassword(row.id)}
                        title={visiblePasswords[row.id] ? "Hide password" : "Show password"}
                        aria-label={visiblePasswords[row.id] ? "Hide password" : "Show password"}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                          {visiblePasswords[row.id] ? (
                            <>
                              <path
                                d="M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                                fill="currentColor"
                              />
                              <circle cx="12" cy="12" r="2" fill="#fff" />
                            </>
                          ) : (
                            <>
                              <path
                                d="M12 5C6 5 2 12 2 12s4 7 10 7c2.4 0 4.6-1.1 6.3-2.5l1.7 1.7 1.4-1.4L4.7 3.2 3.3 4.6 6 7.3C4.1 8.7 2.8 10.7 2 12c0 0 4 7 10 7 1.8 0 3.4-.4 4.9-1.1l2 2 1.4-1.4-15-15L3.9 4.9l2.1 2.1"
                                fill="currentColor"
                              />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td>{formatTime(row.submittedAt)}</td>
                  <td>{row.passwordLength} chars</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No simulation submissions available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
