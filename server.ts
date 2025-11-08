import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import rfs from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';
import logger, { requestLogger, errorLogger } from './logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = '0.0.0.0';
const ENV = process.env.NODE_ENV || 'development';

// Ensure logs directory exists for access logs
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// Rotating file stream for access logs (daily rotation)
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logsDir,
  compress: 'gzip',
});

// Middleware
app.use(helmet()); // security headers
app.use(compression()); // gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger); // express-winston logger
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info('HTTP %s %s', req.method, req.url);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send(`🚀 Server running in ${ENV} mode on ${HOST}:${PORT}`);
});

// Example API route to simulate error
app.get('/api/test-error', (req: Request, res: Response) => {
  throw new Error('Simulated server error');
});

// Centralized error handling middleware
app.use(errorLogger); // express-winston error logger
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Error: %s', err.stack || err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info('✅ Server listening on http://%s:%d [%s]', HOST, PORT, ENV);
});

// Graceful shutdown
const shutdown = () => {
  logger.warn('🛑 Shutdown signal received, closing server...');
  server.close(() => {
    logger.info('✅ Server closed gracefully');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: %s', err.stack || err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection: %s', reason);
  process.exit(1);
});
