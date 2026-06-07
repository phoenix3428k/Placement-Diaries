// ============================================================================
// TYPESCRIPT TYPES AND INTERFACES
// ============================================================================

// File: src/types/index.ts

/**
 * User and Authentication Types
 */

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicProfile {
  id: string;
  userId: string;
  alias: string;
  avatarSeed: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithProfile extends User {
  publicProfile?: PublicProfile | null;
}

/**
 * Session and Auth Types
 */

export interface AuthSession {
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    alias?: string;
    avatarSeed?: string;
  };
  expires: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * API Response Types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Form Types
 */

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateFormData {
  alias?: string;
  bio?: string;
}

export interface PasswordResetFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * UI Component Props
 */

export interface ButtonProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
  id?: string;
}

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Avatar and Identity Types
 */

export interface AvatarConfig {
  seed: string;
  style: string;
  size: number;
  url: string;
}

export interface UserIdentity {
  alias: string;
  avatarSeed: string;
  avatar: AvatarConfig;
}

/**
 * Pagination Types
 */

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Error Types
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Settings and Configuration Types
 */

export interface AccountSettings {
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  notificationsEnabled?: boolean;
}

export interface UserPreferences {
  theme?: "light" | "dark" | "auto";
  language?: string;
  privacyLevel?: "public" | "friends" | "private";
}

/**
 * Activity and Logging Types
 */

export interface UserActivity {
  id: string;
  userId: string;
  action: "login" | "logout" | "register" | "update_profile" | "change_password";
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  status: "success" | "failure";
}

/**
 * Rate Limiting Types
 */

export interface RateLimitConfig {
  key: string;
  limit: number;
  window: number; // milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
}

/**
 * Database Query Types
 */

export interface QueryOptions {
  select?: Record<string, boolean>;
  where?: Record<string, any>;
  orderBy?: Record<string, "asc" | "desc">;
  take?: number;
  skip?: number;
}

/**
 * Security Types
 */

export interface PasswordStrengthResult {
  isValid: boolean;
  score: 0 | 1 | 2 | 3 | 4; // 0 = very weak, 4 = very strong
  errors: string[];
  suggestions: string[];
}

export interface TokenPayload {
  sub: string; // subject (user ID)
  iat: number; // issued at
  exp: number; // expiration
  email?: string;
  alias?: string;
}

/**
 * Next.js Specific Types
 */

export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[]>;
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
}

/**
 * Email Types (for Phase 2)
 */

export interface EmailTemplate {
  to: string;
  subject: string;
  template: "welcome" | "verify-email" | "reset-password" | "confirm-action";
  data: Record<string, any>;
}

export interface EmailResult {
  sent: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Notification Types (for Phase 2+)
 */

export interface Notification {
  id: string;
  userId: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Analytics Types (for Phase 2+)
 */

export interface AnalyticsEvent {
  name: string;
  userId?: string;
  timestamp: Date;
  properties?: Record<string, any>;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  dailyActiveUsers: number;
  registrations: number;
  logins: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * Utility Types
 */

export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export type Awaitable<T> = T | Promise<T>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Branded Types for Type Safety
 */

export type UserId = string & { readonly __brand: "UserId" };
export type Email = string & { readonly __brand: "Email" };
export type Alias = string & { readonly __brand: "Alias" };

export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createEmail(email: string): Email {
  return email as Email;
}

export function createAlias(alias: string): Alias {
  return alias as Alias;
}

/**
 * Helper Type Utilities
 */

export type Entries<T> = Array<[keyof T, T[keyof T]]>;

export function getEntries<T extends Record<string, any>>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type PromiseResolvedType<PromiseType> = PromiseType extends Promise<infer T>
  ? T
  : PromiseType;
