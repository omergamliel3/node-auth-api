import { Router } from "express";
import V1Routes from "./v1/v1.routes";

// Init router
const router = Router();

// Add sub-routes

router.use("/v1", V1Routes);

// Export the base-router
export default router;
