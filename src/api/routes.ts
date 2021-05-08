import { Router } from "express";
import V1Routes from "./v1/v1.routes";

class ApiRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const v1Routes = new V1Routes();
    this.router.use("/v1", v1Routes.router);
  }
}

export default ApiRoutes;
