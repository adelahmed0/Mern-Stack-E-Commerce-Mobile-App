/**
 * Global Router Index
 * Aggregates all modular route handlers and exposes them to the main application.
 */
import { Router } from "express";
// Import auth route
import authRoute from "./auth.route.js";

const router = Router();

/**
 * Main Router Index
 * Mounts specialized routes to their respective path prefixes.
 */

// Authentication & User Management
router.use("/auth", authRoute);

export default router;

