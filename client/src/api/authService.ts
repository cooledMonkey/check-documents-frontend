import { apiClient } from './axiosInstance';
import type {
  RegistrationRequest,
  LoginRequest,
  ChangePasswordRequest,
  JwtAuthenticationResponse,
} from '../types/auth';

export const authService = {
  register: async (data: RegistrationRequest): Promise<JwtAuthenticationResponse> => {
    const response = await apiClient.post<JwtAuthenticationResponse>('/v1/auth/registration', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<JwtAuthenticationResponse> => {
    const response = await apiClient.post<JwtAuthenticationResponse>('/v1/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/v1/auth/logout');
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/v1/auth/change-password', data);
  },
};