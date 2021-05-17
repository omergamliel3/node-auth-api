import { Request, Response, NextFunction } from "express";
import { HttpException } from "@shared/exceptions";
import { StatusCodes } from "http-status-codes";

function errorMiddleware(
  err: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode =
    err instanceof HttpException ? err.status : StatusCodes.BAD_REQUEST;
  return res.status(statusCode).send({
    error: err.message,
  });
}

export default errorMiddleware;
