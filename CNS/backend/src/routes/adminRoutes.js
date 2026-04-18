import { Router } from "express";
import { loginAdmin, verifyAdminSession } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/verify", protectAdmin, verifyAdminSession);

export default router;
