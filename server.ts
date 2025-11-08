/**
 * Complete server.ts — copy this into your project (e.g., src/server.ts)
 *
 * Notes:
 * - Expects a logger module exporting a default logger and named middlewares:
 *     export default logger;
 *     export const requestLogger = ...; // express middleware
 *     export const errorLogger = ...;   // express middleware
 * - Ensure you have morgan and rotating-file-stream installed if you want access logs:
 *     npm install morgan rotating-file-stream
 * - Ensure your tsconfig "outDir" compiles this to the path referenced by package.json (e.g., dist/server.js)
 */

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
// Creates logs/access.log, access.log.2025-11-08.gz, etc.
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logsDir,
  compress: 'gzip',
});

// Attach morgan for access logging (common/combined format as desired)
app.use(morgan('combined', { stream: accessLogStream }));

// Security and parsing middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (express-winston or your custom middleware)
app.use(requestLogger);

// Simple per-request info log (optional, helpful while developing)
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info('HTTP %s %s', req.method, req.originalUrl || req.url);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send(`🚀 Server running in ${ENV} mode`);
});

// Example async route demonstrating error handling
app.get('/api/test-error', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulate async error
    await Promise.reject(new Error('Simulated server error (async)'));
  } catch (err) {
    next(err);
  }
});

// Synchronous example route that throws
app.get('/api/test-error-sync', (req: Request, res: Response, next: NextFunction) => {
  // Express will catch thrown synchronous errors and forward to error handlers
  throw new Error('Simulated server error (sync)');
});

// Error logging middleware (should be before the centralized error handler)
app.use(errorLogger);

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log full stack where available
  logger.error('Unhandled Error: %s', err && (err.stack || err.message || err));
  // Do not leak error details in production
  const status = err && err.status && Number(err.status) >= 400 ? Number(err.status) : 500;
  res.status(status).json({ error: status === 500 ? 'Internal Server Error' : err.message || 'Error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info('✅ Server listening on http://%s:%d [%s]', HOST, PORT, ENV);
});

// Graceful shutdown with timeout to force-close
const shutdown = (signal?: string) => {
  logger.warn('🛑 Shutdown signal%s received, closing server...', signal ? ` (${signal})` : '');
  // Stop accepting new connections
  server.close((err?: Error) => {
    if (err) {
      logger.error('Error while closing server: %s', err.stack || err.message || err);
      process.exit(1);
    }
    logger.info('✅ Server closed gracefully');
    // Allow logger transports to flush (if using winston with async transports)
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

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception: %s', err.stack || err.message || err);
  // attempt graceful shutdown, then exit
  try {
    shutdown('uncaughtException');
  } catch {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection: %s', reason && (reason.stack || reason) || reason);
  // attempt graceful shutdown, then exit
  try {
    shutdown('unhandledRejection');
  } catch {
    process.exit(1);
  }
});

// Export app for testing (optional)
export default app;
