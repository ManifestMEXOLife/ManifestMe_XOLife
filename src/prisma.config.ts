// prisma.config.ts
import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client
export const prisma = new PrismaClient({
  adapter: process.env.DATABASE_URL, // Direct connection to your PostgreSQL
  // If you want to use Prisma Accelerate in the future, you can do:
  // accelerateUrl: process.env.ACCELERATE_URL
});

// Optional: Graceful shutdown in Node.js
if (process.env.NODE_ENV === 'development') {
  // Avoid creating multiple clients in dev with hot-reload
  if (!(global as any).prisma) {
    (global as any).prisma = prisma;
  }
}

export default prisma;
