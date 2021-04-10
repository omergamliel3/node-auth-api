import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { paramMissingError } from "@shared/constants";

function validateParamsIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: paramMissingError,
    });
  }
  if (!userId.match(new RegExp("^\\d+$"))) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "ID must be a number",
    });
  }
  next();
}

export default validateParamsIdMiddleware;
