import { Request, Response, NextFunction } from "express";
import logger from "@shared/logger";
import { StatusCodes } from "http-status-codes";
import {
  bodyMissingPropsErr,
  cannotPerformUpdateErr,
  missingTokenErr,
  notFoundErr,
  noValidEntryFoundErr,
  paramMissingErr,
  tokenAuthFailedErr,
  usernameExistsErr,
  usernameNotFoundErr,
  wrongPasswordErr,
} from "@shared/errors";

function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status: StatusCodes;
  switch (err) {
    case notFoundErr:
      status = StatusCodes.NOT_FOUND;
      break;
    case missingTokenErr:
      status = StatusCodes.UNAUTHORIZED;
      break;
    case tokenAuthFailedErr:
      status = StatusCodes.INTERNAL_SERVER_ERROR;
      break;
    case wrongPasswordErr:
    case usernameNotFoundErr:
    case usernameExistsErr:
    case noValidEntryFoundErr:
    case bodyMissingPropsErr:
    case cannotPerformUpdateErr:
    case paramMissingErr:
      status = StatusCodes.CONFLICT;
      break;
    default:
      status = StatusCodes.BAD_REQUEST;
      break;
  }
  return res.status(status).send();
}

export default errorMiddleware;
