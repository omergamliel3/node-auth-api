import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { missingTokenErr, tokenAuthFailedErr } from "@shared/errors";

const tokenHeader = "x-access-token";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers[tokenHeader] as string | undefined;
  if (!token) {
    return next(missingTokenErr);
  }
  const secret = String(process.env.JWT_SECRET_KEY);
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return next(tokenAuthFailedErr);
    }
    next();
  });
}

export default authMiddleware;
