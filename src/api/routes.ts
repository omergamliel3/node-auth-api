import BaseRoute from "@routes/base.route";
import { Router } from "express";
import V1Routes from "./v1/v1.routes";

class ApiRoutes extends BaseRoute {
  initializeRoutes() {
    const v1Routes = new V1Routes();
    this.router.use("/v1", v1Routes.router);
  }
}

export default ApiRoutes;
