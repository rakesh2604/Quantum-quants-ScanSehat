import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { getRecord, listRecords, searchRecords, uploadRecord, getSummary, getLatest, deleteRecord } from "../controllers/recordController";
import { maxUploadSizeBytes } from "../controllers/recordController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadSizeBytes }
});

const router = Router();

router.use(authenticate);
router.get("/", requireRole("patient"), listRecords);
router.get("/summary", requireRole("patient"), getSummary);
router.get("/latest", requireRole("patient"), getLatest);
router.get("/search", requireRole("patient"), searchRecords);
router.get("/:id", requireRole("patient"), getRecord);
router.delete("/:id", requireRole("patient"), deleteRecord);
router.post("/upload", requireRole("patient"), upload.single("file"), uploadRecord);

export default router;
