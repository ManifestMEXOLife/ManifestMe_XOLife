import morgan from "morgan";
import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";

// HTTP request logger (Morgan)
export const requestLogger = morgan("tiny", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

// Global error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`[${req.method}] ${req.originalUrl} → ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
