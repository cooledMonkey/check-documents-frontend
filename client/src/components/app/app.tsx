import { AppRoute } from "../../const";
import { HistoryPage } from "../../pages/histiry-page/history-page";
import { LoginPage } from "../../pages/login-page/login-page";
import { MainPage } from "../../pages/main-page/main-page"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../../pages/not-found-page/not-found-page";
import { RegistrationPage } from "../../pages/registration-page/registration-page";
import { ProtectedRoute } from "../protected-route/ProtectedRoute";
import { ChangePasswordPage } from "../../pages/change-password-page/ChangePasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.Login} element={<LoginPage />} ></Route>
        <Route path={AppRoute.Registration} element={<RegistrationPage />} ></Route>

        <Route path={AppRoute.Main} element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }  ></Route>

        <Route 
          path={AppRoute.History}
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={AppRoute.ChangePassword}
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export {App}