import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import expressWinston from 'express-winston';

// Base logger
const logger = createLogger({
  level: 'info', // default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // include stack trace
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'manifestme-backend' },
  transports: [
    // Errors
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d', // keep 14 days
    }),
    // Combined logs
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

// Console output for development
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
  msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  expressFormat: true,
  colorize: process.env.NODE_ENV !== 'production',
  ignoreRoute: () => false,
});

export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
});

export default logger;
