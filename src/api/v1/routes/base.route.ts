import { Router } from "express";

export default abstract class BaseRoute {
  router = Router();
  constructor() {
    this.initializeRoutes();
  }

  abstract initializeRoutes(): void;
}
