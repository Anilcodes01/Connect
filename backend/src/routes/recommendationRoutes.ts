import express from "express";
import {
  getRecommendedFriends,
  getMutualFriends,
} from "../controllers/recommendationController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticateToken);

router.get("/recommended", getRecommendedFriends);
router.get("/mutual/:otherUserId", getMutualFriends);

export default router;
