"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_winston_1 = __importDefault(require("express-winston"));
const logsDir = path_1.default.join(__dirname, 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
const errorRotateTransport = new winston_1.transports.DailyRotateFile({
    filename: path_1.default.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});
const combinedRotateTransport = new winston_1.transports.DailyRotateFile({
    filename: path_1.default.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: 'manifestme-backend' },
    transports: [
        errorRotateTransport,
        combinedRotateTransport,
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
    }));
}
exports.requestLogger = express_winston_1.default.logger({
    winstonInstance: logger,
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    expressFormat: true,
    colorize: process.env.NODE_ENV !== 'production',
    ignoreRoute: () => false,
});
exports.errorLogger = express_winston_1.default.errorLogger({
    winstonInstance: logger,
});
process.on('uncaughtException', (err) => {
    logger.error('❌ Uncaught Exception: %s', err.stack || err);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    logger.error('❌ Unhandled Rejection: %s', reason);
    process.exit(1);
});
exports.default = logger;
//# sourceMappingURL=logger.js.map