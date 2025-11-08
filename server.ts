import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Environment setup
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = '0.0.0.0';
const ENV = process.env.NODE_ENV || 'development';

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Use rotating log file for request logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Middleware
app.use(helmet()); // security headers
app.use(compression()); // gzip responses
app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream })); // file logging
app.use(morgan('dev')); // console logging for dev

// Simple request logger (in addition to morgan)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send(`🚀 Server running in ${ENV} mode on ${HOST}:${PORT}`);
});

// Example API route with error simulation
app.get('/api/test-error', (req: Request, res: Response) => {
  throw new Error('Simulated server error');
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`❌ Error: ${err.message}`);
  fs.appendFileSync(
    path.join(logsDir, 'error.log'),
    `[${new Date().toISOString()}] ${err.stack || err.message}\n`
  );
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server with graceful handling
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Server listening on http://${HOST}:${PORT} [${ENV}]`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received: shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  fs.appendFileSync(
    path.join(logsDir, 'error.log'),
    `[${new Date().toISOString()}] Uncaught Exception: ${err.stack}\n`
  );
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  fs.appendFileSync(
    path.join(logsDir, 'error.log'),
    `[${new Date().toISOString()}] Unhandled Rejection: ${reason}\n`
  );
  process.exit(1);
});
