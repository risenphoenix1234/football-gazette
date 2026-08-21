// scripts/seed-admin.ts
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@fg.com" },
    update: {},
    create: {
      email: "admin@fg.com",
      password,
      name: "Main Admin",
    },
  });
}
main().finally(() => process.exit());
