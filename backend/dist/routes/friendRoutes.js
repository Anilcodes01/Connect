"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const friendController_1 = require("../controllers/friendController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.options('*', (0, cors_1.default)());
router.use(authMiddleware_1.authenticateToken);
router.post("/send", friendController_1.sendFriendRequest);
router.get("/pending", friendController_1.getPendingRequests);
router.put("/:requestId/handle", friendController_1.handleFriendRequest);
exports.default = router;
