// User Domain Models - Frontend Contracts
// These types define the expected shape of data from the backend

export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserPreferences {
  emailNotifications: boolean;
  weeklyDigest: boolean;
  theme: 'light' | 'dark' | 'system';
  defaultContentStatus: 'idea' | 'draft';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  timezone: string;
  bio?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Default preferences for new users
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  emailNotifications: true,
  weeklyDigest: false,
  theme: 'system',
  defaultContentStatus: 'idea',
};
