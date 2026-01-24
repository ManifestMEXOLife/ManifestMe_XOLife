import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import expressWinston from 'express-winston';

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Daily rotate transport for errors
const errorRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // keep logs for 14 days
});

// Daily rotate transport for combined logs
const combinedRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Create Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'manifestme-backend' },
  transports: [
    errorRotateTransport,
    combinedRotateTransport,
  ],
});

// Console output in non-production (colorized & readable)
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    })
  );
}

// Express middleware: request logging
export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: true,
  colorize: process.env.NODE_ENV !== 'production',
  ignoreRoute: () => false,
});

// Express middleware: error logging
export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

// Capture uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception: %s', err.stack || err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('❌ Unhandled Rejection: %s', reason);
  process.exit(1);
});

export default logger;
