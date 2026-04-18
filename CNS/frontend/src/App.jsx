import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import FakeLoginPage from "./pages/FakeLoginPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import SecurityTipsPage from "./pages/SecurityTipsPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import Footer from "./components/Footer.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fake-login" element={<FakeLoginPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/security-tips" element={<SecurityTipsPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
