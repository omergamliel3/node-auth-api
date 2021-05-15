import logger from "@shared/logger";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Repository } from "typeorm";

const FILE_NAME = "api/v1/controllers/base.controller";

export default abstract class BaseController<T> {
  protected repository: Repository<T>;
  protected abstract getRepository(): Repository<T>;

  constructor() {
    this.repository = this.getRepository();
  }

  protected exceptionCatcher(
    functionName: string,
    next: NextFunction,
    cb: () => Promise<void>
  ) {
    cb().catch((error) => {
      const errorLog = `${FILE_NAME}\\${functionName}\\${error.message}`;
      logger.err(errorLog);
      next(error);
    });
  }

  protected returnOkStatus(response: Response, body?: any) {
    response.status(StatusCodes.OK).send(body);
  }
}
