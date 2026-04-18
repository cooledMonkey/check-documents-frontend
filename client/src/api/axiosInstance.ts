import axios from 'axios';
import type { ApiError } from '../types/auth';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Если бэкенд использует httpOnly cookies
});

// 👇 Добавляем токен к запросам
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👇 Глобальная обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const err: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Ошибка сервера',
      details: error.response?.data?.details,
    };
    return Promise.reject(err);
  }
);