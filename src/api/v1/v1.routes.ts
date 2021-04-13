import BaseRoute from "@routes/base.route";
import UserRoute from "./routes/user.route";

class V1Routes extends BaseRoute {
  initializeRoutes() {
    const userRoute = new UserRoute();
    this.router.use("/users", userRoute.router);
  }
}

export default V1Routes;
