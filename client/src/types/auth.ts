export interface RegistrationRequest {
  fullName: string;      // ФИО
  email: string;         // Почта
  password: string;      // Пароль
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface JwtAuthenticationResponse {
  token: string;         // JWT токен
  refreshToken?: string; // Опционально, если есть рефреш
  expiresIn?: number;    // Время жизни в секундах
}

export interface UserLockedResponse {
  message: string;
  lockedUntil?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string[]>; // Для валидации полей
}