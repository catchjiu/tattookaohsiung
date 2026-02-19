/**
 * Admin bootstrap — runs at container startup.
 * Creates or updates the admin user from ADMIN_EMAIL and ADMIN_PASSWORD.
 * Safe to run on every deploy; does not touch artists, gallery, or other data.
 */
import { config } from "dotenv";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: ".env.local" });
config({ path: ".env" });

const connectionString = process.env.DATABASE_URL ?? "postgresql://localhost:5432/kh_tattoo";
const adminEmail = process.env.ADMIN_EMAIL?.trim();
const adminPassword = process.env.ADMIN_PASSWORD;

async function main() {
  if (!adminEmail || !adminPassword) {
    console.log("Admin bootstrap skipped: ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
    process.exit(0);
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });
  const passwordHash = await hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "ADMIN",
      name: "Studio Admin",
    },
    update: { passwordHash, email: adminEmail.toLowerCase() },
  });

  console.log("Admin user synced:", adminEmail.toLowerCase());
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Admin bootstrap failed:", e);
  process.exit(1);
});
