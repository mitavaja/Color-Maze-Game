import express from "express";
import { buyBall } from "../controllers/shopController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// buy ball
router.post("/buy/:id", authMiddleware, buyBall);

export default router;