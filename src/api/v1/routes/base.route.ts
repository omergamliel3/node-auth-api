import { Router } from "express";

export default abstract class BaseRoute {
  public router = Router();
  constructor() {
    this.initializeRoutes();
  }
  protected abstract initializeRoutes(): void;
}
