// index.ts or main.ts
import { loadDatabaseSecret } from "./loadPrismaSecret";

(async () => {
  await loadDatabaseSecret();

  // Now you can safely import Prisma client
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany();
  console.log("Users:", users);
})();
