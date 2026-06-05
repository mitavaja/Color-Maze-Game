import express from "express";
import {
  completeLevel,
  getShop,
  buyBall,
  selectBall,
  getLevel,
  collectStar,
  spinWheel,
  buyPowerup,
  usePowerup,
  setGameMode
} from "../controllers/gameController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/level", authMiddleware, getLevel);
router.post("/complete", authMiddleware, completeLevel);
router.post("/collect-star", authMiddleware, collectStar);
router.post("/spin-wheel", authMiddleware, spinWheel);
router.get("/shop", authMiddleware, getShop);
router.post("/buy/:ballId", authMiddleware, buyBall);
router.post("/select/:ballId", authMiddleware, selectBall);
router.post("/powerup/buy/:type", authMiddleware, buyPowerup);
router.post("/powerup/use/:type", authMiddleware, usePowerup);
router.post("/mode", authMiddleware, setGameMode);

export default router;