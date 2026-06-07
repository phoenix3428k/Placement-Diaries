// src/lib/auth.ts
// Auth.js configuration for NextAuth with PostgreSQL and email/password auth

import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { verifyPassword } from "./security";
import { loginSchema } from "./validators";

/**
 * Auth.js Configuration
 * 
 * This implements secure session-based authentication with:
 * - Email/password credentials (hashed with Argon2)
 * - Database sessions (PostgreSQL)
 * - CSRF protection
 * - Secure session cookies
 * 
 * Security Features:
 * - Never stores plaintext passwords
 * - Session tokens stored in database
 * - CSRF tokens automatically generated
 * - Cookies marked as secure & httpOnly
 */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  
  providers: [
    CredentialsProvider({
      // Provider ID for internal use
      id: "credentials",
      
      // Display name (shown on login page)
      name: "Email & Password",
      
      // Form fields displayed to user
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
        rememberMe: {
          label: "Remember me for 30 days",
          type: "checkbox",
        },
      },

      /**
       * Authorize function - validates credentials
       * 
       * This runs on the server and verifies:
       * 1. Email format is valid
       * 2. User exists in database
       * 3. Password matches stored hash
       */
      async authorize(credentials) {
        try {
          // Validate input format
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const validated = loginSchema.parse({
            email: credentials.email,
            password: credentials.password,
          });

          // Find user by email
          const user = await db.user.findUnique({
            where: { email: validated.email },
          });

          if (!user) {
            // Security: Don't reveal if email exists
            throw new Error("Invalid email or password");
          }

          // Verify password against stored hash
          const isPasswordValid = await verifyPassword(
            validated.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          // Return user object for session
          // IMPORTANT: Only return public-safe data
          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null; // Auth failed
        }
      },
    }),
  ],

  /**
   * Callbacks - customize session/JWT behavior
   */
  callbacks: {
    /**
     * JWT callback - customize token claims
     * Used to add custom data to JWT tokens
     */
    async jwt({ token, user }) {
      if (user) {
        // Add user ID to token
        token.sub = user.id;
      }
      return token;
    },

    /**
     * Session callback - customize session data
     * This data is available to the client
     */
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Fetch public profile
        const publicProfile = await db.publicProfile.findUnique({
          where: { userId: token.sub },
          select: {
            id: true,
            alias: true,
            avatarSeed: true,
          },
        });

        // Add safe data to session
        session.user = {
          ...session.user,
          id: token.sub,
          alias: publicProfile?.alias || "Anonymous",
          avatarSeed: publicProfile?.avatarSeed || "",
          // NEVER include: email, userId, passwordHash, etc.
        };
      }
      return session;
    },

    /**
     * Redirect callback - customize where user goes after auth
     */
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Allow same origin
      if (new URL(url).origin === baseUrl) return url;
      
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },

    /**
     * SignIn callback - control whether user can sign in
     */
    async signIn({ user }) {
      // You could add checks here, e.g.:
      // - Email verification status
      // - Account suspension
      // - Rate limiting
      
      if (!user.id) {
        return false;
      }
      
      return true;
    },
  },

  /**
   * Pages configuration
   */
  pages: {
    signIn: "/login",
    error: "/login",
  },

  /**
   * Events - hooks for logging/monitoring
   */
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user?.email} signed in`);
    },
    async signOut() {
      console.log("User signed out");
    },
  },

  /**
   * Session configuration
   */
  session: {
    strategy: "database", // Use database sessions (more secure)
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  /**
   * Cookies configuration
   * Security: Set secure flags for production
   */
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true, // Cannot be accessed by JavaScript
        sameSite: "lax", // CSRF protection
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  /**
   * Debug - enable in development for troubleshooting
   */
  debug: process.env.NODE_ENV === "development",

  /**
   * Theme
   */
  theme: {
    colorScheme: "dark",
    brandColor: "#000000",
  },
};
