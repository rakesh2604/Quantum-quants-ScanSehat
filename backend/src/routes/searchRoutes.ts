import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { searchRecords } from "../controllers/recordController";

const router = Router();

router.get("/", authenticate, requireRole("patient"), searchRecords);

export default router;

