"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const rotating_file_stream_1 = __importDefault(require("rotating-file-stream"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importStar(require("./logger"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = process.env.HOST || '0.0.0.0';
const ENV = process.env.NODE_ENV || 'development';
const logsDir = path_1.default.join(__dirname, 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
const accessLogStream = rotating_file_stream_1.default.createStream('access.log', {
    interval: '1d',
    path: logsDir,
    compress: 'gzip',
});
app.use((0, morgan_1.default)('combined', { stream: accessLogStream }));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.requestLogger);
app.use((req, res, next) => {
    logger_1.default.info('HTTP %s %s', req.method, req.originalUrl || req.url);
    next();
});
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.get('/', (_req, res) => {
    res.send(`🚀 Server running in ${ENV} mode`);
});
app.get('/api/test-error', async (_req, _res, next) => {
    try {
        await Promise.reject(new Error('Simulated server error (async)'));
    }
    catch (err) {
        next(err);
    }
});
app.get('/api/test-error-sync', (_req, _res) => {
    throw new Error('Simulated server error (sync)');
});
app.use(logger_1.errorLogger);
app.use((err, _req, res, _next) => {
    logger_1.default.error('Unhandled Error: %s', err && (err.stack || err.message || err));
    const status = err && err.status && Number(err.status) >= 400 ? Number(err.status) : 500;
    res.status(status).json({ error: status === 500 ? 'Internal Server Error' : err.message || 'Error' });
});
const server = app.listen(PORT, HOST, () => {
    logger_1.default.info('✅ Server listening on http://%s:%d [%s]', HOST, PORT, ENV);
});
const shutdown = (signal) => {
    logger_1.default.warn('🛑 Shutdown signal%s received, closing server...', signal ? ` (${signal})` : '');
    server.close((err) => {
        if (err) {
            logger_1.default.error('Error while closing server: %s', err.stack || err.message || err);
            process.exit(1);
        }
        logger_1.default.info('✅ Server closed gracefully');
        setTimeout(() => process.exit(0), 100);
    });
    setTimeout(() => {
        logger_1.default.error('Forcefully exiting process after timeout');
        process.exit(1);
    }, 30000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
exports.default = app;
//# sourceMappingURL=server.js.map