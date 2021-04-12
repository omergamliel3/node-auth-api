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
  let status: StatusCodes;
  switch (err.message) {
    case "Not found":
      status = StatusCodes.NOT_FOUND;
      break;
    default:
      status = StatusCodes.BAD_REQUEST;
      break;
  }
  return res.status(status).json({
    error: err.message,
  });
}

export default errorMiddleware;
