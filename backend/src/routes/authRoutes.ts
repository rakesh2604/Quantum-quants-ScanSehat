import { Router } from "express";
import multer from "multer";
import {
  beginGoogleOAuth,
  forgotPassword,
  googleCallback,
  login,
  logout,
  refreshSession,
  register,
  resendVerification,
  resetPassword,
  sessionProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  verifyEmail
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshSession);
router.get("/session", authenticate, sessionProfile);
router.post("/verify-email", verifyEmail);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/profile", authenticate, updateProfile);
router.post("/update-password", authenticate, updatePassword);
router.post("/upload-avatar", authenticate, upload.single("file"), uploadAvatar);
router.get("/google", beginGoogleOAuth);
router.get("/google/callback", googleCallback);

export default router;
