import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rfs from 'rotating-file-stream';

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

// Rotating file stream for access logs (daily rotation)
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logsDir,
  compress: 'gzip'
});

// Middleware
app.use(helmet()); // security headers
app.use(compression()); // gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', { stream: accessLogStream })); // file logging
if (ENV === 'development') app.use(morgan('dev')); // console logging

// Request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
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

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = `[${new Date().toISOString()}] ❌ Error: ${err.stack || err.message}\n`;
  console.error(errorMessage);
  fs.appendFileSync(path.join(logsDir, 'error.log'), errorMessage);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT} [${ENV}]`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('🛑 Shutdown signal received, closing server...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  const msg = `[${new Date().toISOString()}] ❌ Uncaught Exception: ${err.stack}\n`;
  console.error(msg);
  fs.appendFileSync(path.join(logsDir, 'error.log'), msg);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  const msg = `[${new Date().toISOString()}] ❌ Unhandled Rejection: ${reason}\n`;
  console.error(msg);
  fs.appendFileSync(path.join(logsDir, 'error.log'), msg);
  process.exit(1);
});
