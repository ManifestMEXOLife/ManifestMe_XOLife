// src/prisma.config.ts
import { PrismaClient } from '@prisma/client';

// Use a singleton pattern in development to avoid multiple clients due to hot reload
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  adapter: process.env.DATABASE_URL, // Direct database connection
  // If you want Prisma Accelerate in the future, you can use:
  // accelerateUrl: process.env.ACCELERATE_URL
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
