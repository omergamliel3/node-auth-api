import { Request, Response, NextFunction } from "express";
import logger from "@shared/logger";
import { StatusCodes } from "http-status-codes";

function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.err(err, false);
  return res.status(StatusCodes.BAD_REQUEST).json({
    error: err.message,
  });
}

export default errorMiddleware;
