import { Router } from "express";
import {
  fetchAnalytics,
  fetchSubmissions,
  fetchStats,
  submitFakeLogin
} from "../controllers/simulationController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// New route names requested for MongoDB-backed storage.
router.post("/login-demo", submitFakeLogin);
router.get("/stats", protectAdmin, fetchStats);

// Legacy routes kept so the current frontend keeps working.
router.post("/login", submitFakeLogin);
router.get("/analytics", protectAdmin, fetchAnalytics);
router.get("/submissions", protectAdmin, fetchSubmissions);

export default router;
