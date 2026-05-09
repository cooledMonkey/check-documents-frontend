import type { JSX } from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authUtils } from "../../utils/auth";

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = authUtils.isAuthenticated();
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="auth-loader">
        <div className="spinner"></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export { ProtectedRoute };