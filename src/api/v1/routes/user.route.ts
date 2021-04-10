import { Router } from "express";
import * as UserController from "@controllers/user.controller";
import validateParamsIdMiddleware from "@middlewares/validateId.middleware.ts";
import authMiddleware from "@middlewares/auth.middleware";

const router = Router();

/******************************************************************************
 *                      Create new user - "POST /api/v1/users/register"
 ******************************************************************************/

router.post("/register", UserController.registerUser);

/******************************************************************************
 *                      Login user - "POST /api/v1/users/login"
 ******************************************************************************/

router.post("/login", UserController.loginUser);

/******************************************************************************
 *                      Update user - "PUT /api/v1/users/:userId"
 ******************************************************************************/

router.put(
  "/:userId",
  authMiddleware,
  validateParamsIdMiddleware,
  UserController.updateUser
);

/******************************************************************************
 *                      Delete user - "DELETE /api/v1/users/:userId"
 ******************************************************************************/

router.delete(
  "/:userId",
  authMiddleware,
  validateParamsIdMiddleware,
  UserController.deleteUser
);

export default router;
