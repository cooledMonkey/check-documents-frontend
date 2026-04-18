import { apiClient } from './axiosInstance';
import type {
  RegistrationRequest,
  LoginRequest,
  ChangePasswordRequest,
  JwtAuthenticationResponse,
} from '../types/auth';

export const authService = {
  // Регистрация
  register: async (data: RegistrationRequest): Promise<JwtAuthenticationResponse> => {
    const response = await apiClient.post<JwtAuthenticationResponse>('/v1/auth/registration', data);
    return response.data;
  },

  // Логин
  login: async (data: LoginRequest): Promise<JwtAuthenticationResponse> => {
    const response = await apiClient.post<JwtAuthenticationResponse>('/v1/auth/login', data);
    return response.data;
  },

  // Логаут
  logout: async (): Promise<void> => {
    await apiClient.post('/v1/auth/logout');
  },

  // Смена пароля
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/v1/auth/change-password', data);
  },
};