import { Router } from "express";
import rateLimit from "express-rate-limit";
import { pool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import * as auth from "../controllers/authController.js";
import * as profile from "../controllers/profileController.js";
import * as avatar from "../controllers/avatarController.js";
import * as calculator from "../controllers/calculatorController.js";
import * as history from "../controllers/historyController.js";

const router = Router();

// Freia tentativas de força bruta em login/cadastro
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Muitas tentativas. Tente novamente em alguns minutos." },
});

router.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "up" });
  } catch {
    res.status(503).json({ status: "error", database: "down" });
  }
});

router.post("/auth/register", authLimiter, auth.register);
router.post("/auth/login", authLimiter, auth.login);

router.get("/profile", requireAuth, profile.getProfile);
router.put("/profile", requireAuth, profile.updateProfile);
router.put("/profile/avatar", requireAuth, avatar.setAvatar);
router.delete("/profile/avatar", requireAuth, avatar.removeAvatar);

router.post("/calculator", requireAuth, calculator.calculate);

router.get("/history/summary", requireAuth, history.summary);
router.get("/history", requireAuth, history.list);

export default router;
