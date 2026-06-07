// src/lib/security.ts
// Password hashing, verification, and security utilities

import { hash, verify } from "argon2";
import { v4 as uuidv4 } from "uuid";

/**
 * Hash a plaintext password using Argon2
 * 
 * Argon2 is a modern, memory-hard password hashing algorithm that is:
 * - Resistant to GPU/ASIC attacks
 * - Computationally expensive (tuned to take ~100ms)
 * - Memory-intensive
 * 
 * @param password - Plaintext password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Argon2 configuration tuned for security while maintaining reasonable speed
    const hashedPassword = await hash(password, {
      memoryCost: 65536, // 64 MB
      timeCost: 3, // 3 iterations
      parallelism: 4, // 4 parallel threads
    });

    return hashedPassword;
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify a plaintext password against a hash
 * 
 * @param password - Plaintext password to verify
 * @param hash - Hash to compare against
 * @returns Promise<boolean> - True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const isValid = await verify(hash, password);
    return isValid;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * Generate a new UUID (v4)
 * 
 * UUIDs are used for all user IDs to prevent:
 * - Sequential ID guessing
 * - Timing attacks
 * - User enumeration
 * 
 * @returns string - UUID v4
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Generate a secure random token for verification/reset emails
 * 
 * @param length - Length of token (default 32 bytes = 64 hex chars)
 * @returns string - Random hex token
 */
export function generateSecureToken(length: number = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Check if a password meets security requirements
 * 
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * 
 * @param password - Password to validate
 * @returns object - Validation result with details
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting helper for sensitive operations
 * 
 * Stores rate limit records in-memory (production should use Redis)
 * 
 * @param key - Identifier (userId, email, IP, etc.)
 * @param limit - Maximum attempts
 * @param window - Time window in milliseconds
 * @returns boolean - True if within limit, false if exceeded
 */
const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  limit: number = 5,
  window: number = 60 * 1000 // 1 minute default
): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(key) || [];

  // Remove old timestamps outside window
  const recent = timestamps.filter((t) => now - t < window);

  if (recent.length >= limit) {
    return false; // Rate limit exceeded
  }

  // Add current timestamp
  recent.push(now);
  rateLimitStore.set(key, recent);

  return true; // Within limit
}

/**
 * Reset rate limit for a key (e.g., after successful login)
 * 
 * @param key - Identifier
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Sanitize email address
 * 
 * - Trim whitespace
 * - Convert to lowercase
 * - Basic validation
 * 
 * @param email - Email to sanitize
 * @returns string - Sanitized email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Check if email is valid
 * 
 * Note: This is a simple check. For production, consider
 * implementing email verification via confirmation links.
 * 
 * @param email - Email to validate
 * @returns boolean
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Hash sensitive string (not for passwords, use hashPassword instead)
 * 
 * Used for hashing things like email verification tokens
 * 
 * @param input - String to hash
 * @returns string - SHA-256 hash as hex
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Security headers to include in API responses
 */
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

/**
 * CORS headers for API endpoints
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // 24 hours
};
