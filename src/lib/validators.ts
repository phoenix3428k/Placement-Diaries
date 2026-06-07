// src/lib/validators.ts
// Zod schemas for input validation across the application

import { z } from "zod";

/**
 * AUTHENTICATION SCHEMAS
 */

export const registerSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

/**
 * PROFILE SCHEMAS
 */

export const updateAliasSchema = z.object({
  alias: z
    .string()
    .min(3, "Alias must be at least 3 characters")
    .max(20, "Alias must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Alias can only contain letters, numbers, underscores, and hyphens"
    ),
});

export type UpdateAliasInput = z.infer<typeof updateAliasSchema>;

export const updateProfileSchema = z.object({
  alias: z
    .string()
    .min(3, "Alias must be at least 3 characters")
    .max(20, "Alias must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Alias can only contain letters, numbers, underscores, and hyphens"
    )
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const checkAliasSchema = z.object({
  alias: z
    .string()
    .min(3, "Alias must be at least 3 characters")
    .max(20, "Alias must be at most 20 characters"),
});

export type CheckAliasInput = z.infer<typeof checkAliasSchema>;

/**
 * GENERAL UTILITY SCHEMAS
 */

export const idSchema = z.string().uuid("Invalid ID format");

export const emailSchema = z.string().email("Invalid email address").toLowerCase().trim();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * API RESPONSE SCHEMAS
 * Used for validating API responses and documenting return types
 */

export const successResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.any().optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
});

/**
 * Validation helper function
 * 
 * Safely validates data and returns result with error handling
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns { success, data, errors }
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string[]> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: ["Validation failed"] } };
  }
}

/**
 * Safe parse function
 * 
 * Returns null on validation error instead of throwing
 * 
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Parsed data or null
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch {
    return null;
  }
}
