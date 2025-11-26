import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { generateAccessSession, redeemAccess, sessionRecords } from "../controllers/accessController";

const router = Router();

router.post("/redeem", redeemAccess);
router.get("/session/:token", sessionRecords);

router.use(authenticate, requireRole("patient"));
router.post("/generate", generateAccessSession);

export default router;
