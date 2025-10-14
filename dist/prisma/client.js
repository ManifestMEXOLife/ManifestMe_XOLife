"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Standard Prisma client singleton pattern. This avoids creating multiple
// instances when using hot-reload (e.g., nodemon/ts-node-dev) in development.
const client_1 = require("@prisma/client");
const prisma = global.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production')
    global.prisma = prisma;
exports.default = prisma;
//# sourceMappingURL=client.js.map