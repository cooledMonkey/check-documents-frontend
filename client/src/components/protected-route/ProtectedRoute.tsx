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
    // Проверяем токен при монтировании
    const checkAuth = () => {
      const authStatus = authUtils.isAuthenticated();
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  }, []);

  // Пока проверяем авторизацию — показываем лоадер
  if (isAuthenticated === null) {
    return (
      <div className="auth-loader">
        <div className="spinner"></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  // Если не авторизован — редирект на логин с сохранением пути
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Авторизован — рендерим дочерние компоненты
  return children;
}

export { ProtectedRoute };