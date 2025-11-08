import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import logger from './logger';

dotenv.config();

const app = express();

// Environment setup
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = '0.0.0.0';
const ENV = process.env.NODE_ENV || 'development';

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Rotating file stream for access logs
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logsDir,
  compress: 'gzip',
});

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan request logging to file and console
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
if (ENV === 'development') {
  app.use(morgan('dev'));
}

// Custom request logger middleware (enhanced)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    logger.info(
      '%s %s %d %sms',
      req.method,
      req.originalUrl,
      res.statusCode,
      durationMs.toFixed(2)
    );
  });

  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  logger.info('Root endpoint accessed');
  res.send(`🚀 Server running in ${ENV} mode on ${HOST}:${PORT}`);
});

// Example error route
app.get('/api/test-error', (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('Simulated server error');
  } catch (err) {
    next(err);
  }
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error occurred: %s', err.stack || err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info(`✅ Server listening on http://${HOST}:${PORT} [${ENV}]`);
});

// Graceful shutdown
const shutdown = () => {
  logger.info('🛑 Shutdown signal received, closing server...');
  server.close(() => {
    logger.info('✅ Server closed gracefully');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: %s', err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection: %s', reason);
  process.exit(1);
});
