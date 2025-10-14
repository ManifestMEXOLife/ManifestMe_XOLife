"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
beforeAll(async () => {
    // Setup test database
});
afterAll(async () => {
    await prisma.$disconnect();
});
beforeEach(async () => {
    // Clean up before each test
});
afterEach(async () => {
    // Clean up after each test
});
//# sourceMappingURL=setup.js.map