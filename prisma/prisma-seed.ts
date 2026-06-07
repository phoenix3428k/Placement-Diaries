// ============================================================================
// PRISMA SEED SCRIPT
// File: prisma/seed.ts
// 
// Run with: npx prisma db seed
// This script populates the database with test data for development
// ============================================================================

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/security";
import { generateRandomAlias, generateAvatarSeed } from "../src/lib/aliases";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (careful in production!)
  await prisma.publicProfile.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✨ Cleared existing data");

  // Create test users
  const testUsers = [
    {
      email: "demo@example.com",
      password: "DemoPass123!",
      alias: "SilentWolf",
    },
    {
      email: "test@example.com",
      password: "TestPass456!",
      alias: "MidnightCoder",
    },
    {
      email: "student@example.com",
      password: "Student789!",
      alias: "LostGraduate",
    },
  ];

  console.log("👤 Creating test users...");

  for (const userData of testUsers) {
    try {
      const passwordHash = await hashPassword(userData.password);
      const avatarSeed = generateAvatarSeed();

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash,
          publicProfile: {
            create: {
              alias: userData.alias,
              avatarSeed,
              bio: `Test user with alias ${userData.alias}. This is a demo account.`,
            },
          },
        },
      });

      console.log(`  ✓ Created user: ${user.email} (${userData.alias})`);
    } catch (error) {
      console.error(`  ✗ Failed to create user ${userData.email}:`, error);
    }
  }

  // Create additional random test users (for testing queries)
  console.log("🔀 Creating random test users...");

  const randomUsersCount = 5;
  for (let i = 0; i < randomUsersCount; i++) {
    try {
      const email = `random${i}@example.com`;
      const passwordHash = await hashPassword(`Password${i}123!`);
      const alias = generateRandomAlias();
      const avatarSeed = generateAvatarSeed();

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          publicProfile: {
            create: {
              alias,
              avatarSeed,
              bio: `Random test user ${i + 1}. Created by seed script.`,
            },
          },
        },
      });

      console.log(`  ✓ Created random user: ${alias}`);
    } catch (error) {
      console.error(`  ✗ Failed to create random user ${i}:`, error);
    }
  }

  // Verify data
  const userCount = await prisma.user.count();
  const profileCount = await prisma.publicProfile.count();

  console.log("\n✅ Database seed completed!");
  console.log(`   Total users: ${userCount}`);
  console.log(`   Total profiles: ${profileCount}`);

  console.log("\n📝 Test Credentials:");
  console.log("   Email: demo@example.com");
  console.log("   Password: DemoPass123!");
  console.log("   Alias: SilentWolf");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
