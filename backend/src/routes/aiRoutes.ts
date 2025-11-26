import { Router } from "express";
import { aiEmbedding, aiOCR, aiSummary } from "../controllers/aiController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.post("/ocr", aiOCR);
router.post("/summary", aiSummary);
router.post("/embedding", aiEmbedding);

export default router;
