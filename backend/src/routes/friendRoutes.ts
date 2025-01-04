import express from "express";
import {
  sendFriendRequest,
  getPendingRequests,
  handleFriendRequest,
} from "../controllers/friendController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticateToken);

router.post("/send", sendFriendRequest);
router.get("/pending", getPendingRequests);
router.put("/:requestId/handle", handleFriendRequest);


export default router;