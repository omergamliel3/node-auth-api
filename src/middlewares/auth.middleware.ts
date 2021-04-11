import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { tokenAuthFailed } from "@shared/constants";

const tokenHeader = "x-access-token";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers[tokenHeader] as string | undefined;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send();
  }
  const secret = String(process.env.JWT_SECRET_KEY);
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: tokenAuthFailed,
      });
    }
    next();
  });
}

export default authMiddleware;
