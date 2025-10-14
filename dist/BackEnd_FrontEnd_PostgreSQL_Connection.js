"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Prisma client instance for database operations
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
// Database connection helper
const connectDatabase = async () => {
    try {
        await exports.prisma.$connect();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
// Graceful shutdown
const disconnectDatabase = async () => {
    await exports.prisma.$disconnect();
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=BackEnd_FrontEnd_PostgreSQL_Connection.js.map