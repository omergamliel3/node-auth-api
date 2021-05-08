import BaseController from "@controllers/base.controller";
import { Router, RouterOptions } from "express";

export default abstract class BaseRoute<Controller extends BaseController<any>> {
  public router: Router;
  protected controller: Controller;

  constructor(routerOptions?: RouterOptions) {
    this.router = Router(routerOptions);
    this.controller = this.getController();
    this.initializeRoutes();
  }
  protected abstract initializeRoutes(): void;
  protected abstract getController(): Controller;
}
