import { HttpException } from "@shared/exceptions";
import logger from "@shared/logger";
import { sanitize } from "class-sanitizer";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const FILE_NAME = "src/middlewares/validation.middleware";

function validationMiddleware(
  type: any,
  skipMissingProperties = false,
  isQuery = false
) {
  const FUNC_NAME = "validationMiddleware";

  return async (req: Request, res: Response, next: NextFunction) => {
    const objectToValidate = isQuery ? req.query : req.body;
    const dtoObj = plainToClass(type, objectToValidate);
    const valdationErrors = await validate(dtoObj, {
      skipMissingProperties,
    });
    if (valdationErrors.length > 0) {
      const dtoErrors = valdationErrors
        .map((error: ValidationError) =>
          (Object as any).values(error.constraints)
        )
        .join(", ");
      logger.info(
        `File: ${FILE_NAME}, Func: ${FUNC_NAME}, Error: ${dtoErrors}`
      );
      next(new HttpException(StatusCodes.BAD_REQUEST, dtoErrors));
    } else {
      // sanitize the object and call next middleware
      sanitize(dtoObj);
      req.body = dtoObj;
      next();
    }
  };
}

export default validationMiddleware;
