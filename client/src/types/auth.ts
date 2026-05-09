export interface RegistrationRequest {
  fullName: string;   
  email: string;     
  password: string;     
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
  token: string;     
  refreshToken?: string; 
  expiresIn?: number;  
}

export interface UserLockedResponse {
  message: string;
  lockedUntil?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string[]>; 
}