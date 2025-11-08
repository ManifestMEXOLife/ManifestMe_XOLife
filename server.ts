import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import logger, { requestLogger, errorLogger } from './logger';

const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = process.env.HOST || '0.0.0.0';
const ENV = process.env.NODE_ENV || 'development';

// Ensure logs directory exists for access logs
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Rotating file stream for access logs (daily rotation)
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logsDir,
  compress: 'gzip',
});

// Attach morgan for access logging; write to rotating file
app.use(morgan('combined', { stream: accessLogStream }));

// Security + parsing middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (from src/logger using express-winston)
app.use(requestLogger);

// Lightweight per-request info log (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info('HTTP %s %s', req.method, req.originalUrl || req.url);
  next();
});

// Routes
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (_req: Request, res: Response) => {
  res.send(`🚀 Server running in ${ENV} mode`);
});

// Example async route showing correct error forwarding
app.get('/api/test-error', async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await Promise.reject(new Error('Simulated server error (async)'));
  } catch (err) {
    next(err);
  }
});

// Example synchronous route that throws
app.get('/api/test-error-sync', (_req: Request, _res: Response) => {
  throw new Error('Simulated server error (sync)');
});

// Error logger (express-winston) — place before centralized handler
app.use(errorLogger);

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled Error: %s', err && (err.stack || err.message || err));
  const status = err && err.status && Number(err.status) >= 400 ? Number(err.status) : 500;
  res.status(status).json({ error: status === 500 ? 'Internal Server Error' : err.message || 'Error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info('✅ Server listening on http://%s:%d [%s]', HOST, PORT, ENV);
});

// Graceful shutdown
const shutdown = (signal?: string) => {
  logger.warn('🛑 Shutdown signal%s received, closing server...', signal ? ` (${signal})` : '');
  server.close((err?: Error) => {
    if (err) {
      logger.error('Error while closing server: %s', err.stack || err.message || err);
      process.exit(1);
    }
    logger.info('✅ Server closed gracefully');
    // allow logger transports a moment to flush
    setTimeout(() => process.exit(0), 100);
  });

  // Force exit if shutdown takes too long
  setTimeout(() => {
    logger.error('Forcefully exiting process after timeout');
    process.exit(1);
  }, 30_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Note: src/logger.ts already registers handlers for uncaughtException and unhandledRejection,
// so we avoid registering duplicates here to prevent multiple process.exit calls.

export default app;
