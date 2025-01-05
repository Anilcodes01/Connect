import express from "express";
import cors from 'cors';
import {
  sendFriendRequest,
  getPendingRequests,
  handleFriendRequest,
} from "../controllers/friendController";
import { authenticateToken } from "../middlewares/authMiddleware";


const router = express.Router();

router.options('*', cors());

router.use(authenticateToken);

router.post("/send", sendFriendRequest);
router.get("/pending", getPendingRequests);
router.put("/:requestId/handle", handleFriendRequest);


export default router;