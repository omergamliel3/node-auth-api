import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { HttpException } from "@shared/exceptions";
import { StatusCodes } from "http-status-codes";

const tokenHeader = "x-access-token";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers[tokenHeader] as string | undefined;
  if (!token) {
    return next(
      new HttpException(StatusCodes.UNAUTHORIZED, "Access token is missing")
    );
  }
  const secret = String(process.env.JWT_SECRET_KEY);
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return next(
        new HttpException(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to authenticate token"
        )
      );
    }
    next();
  });
}

export default authMiddleware;
