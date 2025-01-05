"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendationController_1 = require("../controllers/recommendationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
router.get("/recommended", recommendationController_1.getRecommendedFriends);
router.get("/mutual/:otherUserId", recommendationController_1.getMutualFriends);
exports.default = router;
