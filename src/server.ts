import "reflect-metadata";

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import express, { NextFunction, Request, Response } from "express";
import baseRoutes from "src/api/routes";
import errorMiddleware from "@middlewares/error.middleware";
import { apiLimiterMsg, DEVELOPMENT, PRODUCTION } from "@shared/constants";

const app = express();
const baseAPIEndpoint = "/api";

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup rate limit
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max requests pre windowMs
  message: apiLimiterMsg,
});
app.use(baseAPIEndpoint, apiLimiter);

if (process.env.NODE_ENV === DEVELOPMENT) {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === PRODUCTION) {
  app.use(helmet());
}

// Add APIs
app.use(baseAPIEndpoint, baseRoutes);

// Handle unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");
  next(error);
});

// Handle route errors
app.use(errorMiddleware);

export default app;
