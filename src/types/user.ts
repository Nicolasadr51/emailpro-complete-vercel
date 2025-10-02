// Types pour les utilisateurs de la plateforme EmailPro

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface UserPreferences {
  language: 'fr' | 'en';
  timezone: string;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// Requests pour les API
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  preferences?: Partial<UserPreferences>;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Constantes
export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Administrateur',
  user: 'Utilisateur',
  viewer: 'Observateur'
};

export const LANGUAGES = {
  fr: 'Français',
  en: 'English'
} as const;

export const THEMES = {
  light: 'Clair',
  dark: 'Sombre',
  auto: 'Automatique'
} as const;