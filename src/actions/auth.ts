// src/actions/auth.ts
// Server actions for authentication

"use server";

import { signIn, signOut } from "next-auth/react";
import { db } from "@/lib/db";
import { hashPassword, checkRateLimit, resetRateLimit, sanitizeEmail } from "@/lib/security";
import { registerSchema, loginSchema } from "@/lib/validators";
import { createNewIdentity, isAliasReserved } from "@/lib/aliases";
import { redirect } from "next/navigation";
import { AuthError } from "@auth/core/errors";

/**
 * User Registration Action
 * 
 * Creates new user account with:
 * - Email/password authentication
 * - Auto-generated anonymous identity (alias + avatar)
 * - Secure password hashing
 * - Duplicate email prevention
 * 
 * @param formData - Registration form data
 * @returns { success, message, userId? } | null if error
 */
export async function registerUser(formData: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    // Rate limiting check
    const email = sanitizeEmail(formData.email);
    if (!checkRateLimit(`register_${email}`, 3, 60 * 1000)) {
      return {
        success: false,
        message: "Too many registration attempts. Please try again later.",
      };
    }

    // Validate input
    const validated = registerSchema.parse({
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Generate anonymous identity
    const identity = createNewIdentity();

    // Check if generated alias is reserved
    if (isAliasReserved(identity.alias)) {
      // Regenerate if reserved (very unlikely)
      const newIdentity = createNewIdentity();
      Object.assign(identity, newIdentity);
    }

    // Create user with public profile
    const user = await db.user.create({
      data: {
        email: validated.email,
        passwordHash,
        publicProfile: {
          create: {
            alias: identity.alias,
            avatarSeed: identity.avatarSeed,
          },
        },
      },
      select: {
        id: true,
        email: false, // Never return email to client
        publicProfile: {
          select: {
            alias: true,
            avatarSeed: true,
          },
        },
      },
    });

    resetRateLimit(`register_${email}`);

    return {
      success: true,
      message: "Account created successfully! Redirecting to login...",
      userId: user.id,
      alias: user.publicProfile?.alias,
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }
    }

    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
}

/**
 * User Login Action
 * 
 * Authenticates user and creates session
 * 
 * @param formData - Login form data
 * @param redirectTo - URL to redirect to after login
 * @returns { success, message } | redirect on success
 */
export async function loginUser(
  formData: {
    email: string;
    password: string;
    rememberMe?: boolean;
  },
  redirectTo: string = "/dashboard"
) {
  try {
    // Rate limiting
    const email = sanitizeEmail(formData.email);
    if (!checkRateLimit(`login_${email}`, 5, 15 * 60 * 1000)) {
      return {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes.",
      };
    }

    // Validate input
    const validated = loginSchema.parse({
      email: formData.email,
      password: formData.password,
    });

    // Sign in with NextAuth
    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (!result?.ok || result?.error) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Reset rate limit on successful login
    resetRateLimit(`login_${email}`);

    // Redirect to dashboard
    redirect(redirectTo);
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          success: false,
          message: "Invalid email or password.",
        };
      }
    }

    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
}

/**
 * User Logout Action
 * 
 * Destroys session and clears cookies
 * 
 * @param redirectTo - URL to redirect to after logout (default: home)
 */
export async function logoutUser(redirectTo: string = "/") {
  try {
    await signOut({
      redirect: false,
    });

    // Redirect after logout
    redirect(redirectTo);
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Logout failed. Please try again.",
    };
  }
}

/**
 * Check if email exists (for duplicate prevention)
 * 
 * @param email - Email to check
 * @returns { exists: boolean }
 */
export async function checkEmailExists(email: string) {
  try {
    const sanitized = sanitizeEmail(email);

    const user = await db.user.findUnique({
      where: { email: sanitized },
      select: { id: true },
    });

    return {
      exists: !!user,
    };
  } catch (error) {
    console.error("Email check error:", error);
    return {
      exists: false,
    };
  }
}

/**
 * Request password reset email
 * 
 * Placeholder for Phase 2 when email service is added
 * 
 * @param email - User's email
 * @returns { success, message }
 */
export async function requestPasswordReset(email: string) {
  try {
    const sanitized = sanitizeEmail(email);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: sanitized },
      select: { id: true },
    });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return {
        success: true,
        message: "If an account exists, a reset link has been sent.",
      };
    }

    // TODO: Generate reset token and send email (Phase 2)
    // For now, just return success

    return {
      success: true,
      message: "If an account exists, a reset link has been sent.",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      message: "Failed to process request. Please try again.",
    };
  }
}
