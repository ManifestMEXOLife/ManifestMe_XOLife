// Standard Prisma client singleton pattern. This avoids creating multiple
// instances when using hot-reload (e.g., nodemon/ts-node-dev) in development.
import { PrismaClient } from '@prisma/client';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
