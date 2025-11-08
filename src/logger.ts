import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import expressWinston from 'express-winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Daily rotate transport for errors
const errorRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Daily rotate transport for combined logs
const combinedRotateTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Create Winston logger
const logger = createLogger({
  level: 'info', // default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // include stack traces
    format.splat(),
    format.json() // structured JSON logs
  ),
  defaultMeta: { service: 'manifestme-backend' },
  transports: [errorRotateTransport, combinedRotateTransport],
});

// Console output in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

// Catch unhandled exceptions & promise rejections
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: %s', err.stack || err);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection: %s', reason);
});

// Optional: Express middleware for logging requests/responses
export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: true,
  colorize: process.env.NODE_ENV !== 'production',
  ignoreRoute: () => false,
});

export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

export default logger;
