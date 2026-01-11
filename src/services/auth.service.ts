// Authentication Service Interface
// This service contract defines how the frontend will interact with the backend
// Currently unimplemented - will be connected to a real backend later

import { User, AuthState } from '../types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthServiceError {
  message: string;
  code: string;
}

// Service interface - to be implemented when backend is available
export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  updateProfile(userId: string, updates: Partial<User>): Promise<User>;
}

// Placeholder implementation that always indicates backend is not connected
class AuthServiceNotImplemented implements IAuthService {
  private readonly notImplementedError: AuthServiceError = {
    message: 'Backend service not connected. This feature requires a backend implementation.',
    code: 'SERVICE_NOT_IMPLEMENTED',
  };

  async login(_credentials: LoginCredentials): Promise<AuthResponse> {
    throw this.notImplementedError;
  }

  async register(_credentials: RegisterCredentials): Promise<AuthResponse> {
    throw this.notImplementedError;
  }

  async logout(): Promise<void> {
    throw this.notImplementedError;
  }

  async getCurrentUser(): Promise<User | null> {
    // Returns null to indicate no user is authenticated
    return null;
  }

  async forgotPassword(_email: string): Promise<void> {
    throw this.notImplementedError;
  }

  async resetPassword(_token: string, _newPassword: string): Promise<void> {
    throw this.notImplementedError;
  }

  async updateProfile(_userId: string, _updates: Partial<User>): Promise<User> {
    throw this.notImplementedError;
  }
}

// Export singleton instance
export const authService: IAuthService = new AuthServiceNotImplemented();

// Helper to check if service is implemented
export function isAuthServiceImplemented(): boolean {
  return false; // Will be true when backend is connected
}
