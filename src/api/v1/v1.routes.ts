import { Router } from "express";
import UserRoute from "./routes/user.route";

class V1Routes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    const userRoute = new UserRoute();
    this.router.use("/users", userRoute.router);
  }
}

export default V1Routes;
