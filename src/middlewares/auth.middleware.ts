import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-access-token"] as string | undefined;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED);
  }
  const secret = String(process.env.JWT_SECRET_KEY);
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to authenticate token",
      });
    }
    next();
  });
}

export default authMiddleware;
