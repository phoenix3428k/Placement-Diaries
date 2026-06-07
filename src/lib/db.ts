// src/lib/db.ts
// Prisma client singleton for database access

import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * 
 * This prevents multiple Prisma client instances in development
 * where hot module reloading could cause connection issues.
 * 
 * In production, this is still a singleton for connection pooling.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Enable query logging in development
    log: process.env.NODE_ENV === "development"
      ? ["warn", "error"]
      : ["error"],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

/**
 * Export type for user queries (includes computed fields)
 */
export type UserWithPublicProfile = {
  id: string;
  email: string;
  publicProfile?: {
    id: string;
    userId: string;
    alias: string;
    avatarSeed: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Export type for public profile queries
 */
export type PublicProfileType = {
  id: string;
  userId: string;
  alias: string;
  avatarSeed: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
};
