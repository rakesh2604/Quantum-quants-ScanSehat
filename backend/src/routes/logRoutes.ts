import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { listLogs } from "../controllers/accessController";

const router = Router();

router.get("/", authenticate, requireRole("patient"), listLogs);

export default router;

