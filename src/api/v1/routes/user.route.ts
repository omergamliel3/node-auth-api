import UserController from "@controllers/user.controller";
import authMiddleware from "@middlewares/auth.middleware";
import BaseRoute from "./base.route";

class UserRoute extends BaseRoute {
  // ask Maty
  private controller: UserController;
  initializeRoutes() {
    this.controller = new UserController();

    /******************************************************************************
     *                      Create new user - "POST /api/v1/users/register"
     ******************************************************************************/

    this.router.post("/register", this.controller.registerUser);

    /******************************************************************************
     *                      Login user - "POST /api/v1/users/login"
     ******************************************************************************/

    this.router.post("/login", this.controller.loginUser);

    /******************************************************************************
     *                      Update user - "PUT /api/v1/users/:userId"
     ******************************************************************************/

    this.router.put("/:userId", authMiddleware, this.controller.updateUser);

    /******************************************************************************
     *                      Delete user - "DELETE /api/v1/users/:userId"
     ******************************************************************************/

    this.router.delete("/:userId", authMiddleware, this.controller.deleteUser);
  }
}

export default UserRoute;
