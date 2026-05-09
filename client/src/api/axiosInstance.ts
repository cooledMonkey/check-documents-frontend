import axios from 'axios';
import type { ApiError } from '../types/auth';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const PUBLIC_ENDPOINTS = [
  '/v1/auth/registration',
  '/v1/auth/login',
];

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(path => 
    config.url?.includes(path)
  );
  
  if (token && config.headers && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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