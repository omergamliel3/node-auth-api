import { Router } from "express";
import UserRouter from "./routes/user.route";

// Init router
const router = Router();

// Add sub-routes

router.use("/users", UserRouter);

// Export the base-router
export default router;
