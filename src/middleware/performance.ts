import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestTimer = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const time = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
    logger.info(`Response time: ${req.method} ${req.originalUrl} - ${time}ms`);
  });

  next();
};
