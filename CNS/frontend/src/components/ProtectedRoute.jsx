import { Navigate } from "react-router-dom";
import { isAdminAuthenticated, logoutAdmin } from "../utils/auth.js";
import { useEffect, useState } from "react";
import { verifyAdminSessionRequest } from "../api/client.js";

function ProtectedRoute({ children }) {
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!isAdminAuthenticated()) {
        setChecking(false);
        setIsVerified(false);
        return;
      }

      try {
        await verifyAdminSessionRequest();
        setIsVerified(true);
      } catch (error) {
        logoutAdmin();
        setIsVerified(false);
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, []);

  if (checking) {
    return null;
  }

  if (!isVerified) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute;
