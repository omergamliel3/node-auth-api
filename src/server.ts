import "reflect-metadata";

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import express, { NextFunction, Request, Response } from "express";
import ApiRoutes from "./api/routes";
import errorMiddleware from "@middlewares/error.middleware";
import {
  apiLimiterMsg,
  DEVELOPMENT,
  PRODUCTION,
  baseAPIEndpoint,
} from "@shared/constants";
import logger from "@shared/logger";
import { HttpException } from "@shared/exceptions";
import { StatusCodes } from "http-status-codes";

export default class App {
  public app: express.Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initApp();
  }

  // Init app
  private initApp() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // Init middlewares
  private initializeMiddlewares() {
    this.app.use(cors());

    if (process.env.NODE_ENV === DEVELOPMENT) {
      this.app.use(morgan("dev"));
    }

    // Security
    if (process.env.NODE_ENV === PRODUCTION) {
      this.app.use(helmet());
    }

    const apiLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 100, // max requests pre windowMs
      message: apiLimiterMsg,
    });
    this.app.use(baseAPIEndpoint, apiLimiter);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false })); // ?
  }

  // Init routes
  private initializeRoutes() {
    const apiRoutes = new ApiRoutes();
    this.app.use(baseAPIEndpoint, apiRoutes.router);
  }

  // Init error handling
  private initializeErrorHandling() {
    // Handle unknown routes
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new HttpException(StatusCodes.NOT_FOUND, "Not found"));
    });

    // Handle route errors
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`App listening on port ${this.port}`);
    });
  }
}
