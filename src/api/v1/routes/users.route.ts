import UserController from "@controllers/users.controller";
import authMiddleware from "@middlewares/auth.middleware";
import validationMiddleware from "@middlewares/validation.middleware";
import { LoginDto, RegisterDto, UpdateDto } from "@dto/users.dto";
import BaseRoute from "./base.route";

class UserRoute extends BaseRoute<UserController> {
  protected getController(): UserController {
    return new UserController();
  }

  protected initializeRoutes() {
    /******************************************************************************
     *                      Create new user - "POST /api/v1/users/register"
     ******************************************************************************/

    this.router.post(
      "/register",
      validationMiddleware(RegisterDto),
      this.controller.registerUser.bind(this.controller)
    );

    /******************************************************************************
     *                      Login user - "POST /api/v1/users/login"
     ******************************************************************************/

    this.router.post(
      "/login",
      validationMiddleware(LoginDto),
      this.controller.loginUser.bind(this.controller)
    );

    /******************************************************************************
     *                      Update user - "PUT /api/v1/users/:userId"
     ******************************************************************************/

    this.router.put(
      "/:userId",
      validationMiddleware(UpdateDto, true),
      authMiddleware,
      this.controller.updateUser.bind(this.controller)
    );

    /******************************************************************************
     *                      Delete user - "DELETE /api/v1/users/:userId"
     ******************************************************************************/

    this.router.delete(
      "/:userId",
      authMiddleware,
      this.controller.deleteUser.bind(this.controller)
    );
  }
}

export default UserRoute;
