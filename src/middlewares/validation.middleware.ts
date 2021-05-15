import logger from "@shared/logger";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

const FILE_NAME = "src/middlewares/validation.middleware";

function validationMiddleware(
  type: any,
  skipMissingProperties = false,
  isQuery = false
) {
  const FUNC_NAME = "validationMiddleware";

  return async (req: Request, res: Response, next: NextFunction) => {
    const objectToValidate = isQuery ? req.query : req.body;
    const valdationErrors = await validate(
      plainToClass(type, objectToValidate),
      {
        skipMissingProperties,
      }
    );
    if (valdationErrors.length > 0) {
      logger.err(`${FILE_NAME}\\${FUNC_NAME}\\`);
      next(new Error("Bad request"));
    } else {
      next();
    }
  };
}

export default validationMiddleware;
