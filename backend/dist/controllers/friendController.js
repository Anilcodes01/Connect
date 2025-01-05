"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFriendRequest = exports.getPendingRequests = exports.sendFriendRequest = void 0;
const FriendSchema_1 = __importDefault(require("../models/FriendSchema"));
const FriendRequestSchema_1 = __importDefault(require("../models/FriendRequestSchema"));
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { to } = req.body;
        const from = req.userId;
        if (!from) {
            res.status(401).json({
                message: "Authentication required",
            });
            return;
        }
        if (from === to) {
            res.status(400).json({
                message: "Can't send friend request to yourself",
            });
            return;
        }
        const [toUser, fromUser] = yield Promise.all([
            UserSchema_1.default.findById(to),
            UserSchema_1.default.findById(from),
        ]);
        if (!toUser || !fromUser) {
            res.status(404).json({
                message: "User not found...!",
            });
            return;
        }
        const existingRequest = yield FriendRequestSchema_1.default.findOne({
            $or: [
                { from, to, status: "pending" },
                { from: to, to: from, status: "pending" },
            ],
        });
        if (existingRequest) {
            res.status(400).json({
                message: "Friend request already axists",
            });
            return;
        }
        const existingFriendShip = yield FriendSchema_1.default.findOne({
            $or: [
                { user: from, friend: to },
                { user: to, friend: from },
            ],
        });
        if (existingFriendShip) {
            res.status(400).json({
                message: "Users are already friends",
            });
            return;
        }
        const friendRequest = new FriendRequestSchema_1.default({
            from,
            to,
            status: "pending",
        });
        yield friendRequest.save();
        res.status(201).json({
            message: "Friend request sent successfully",
            request: friendRequest,
        });
    }
    catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({
            message: "Error sending friend request",
            error: error.message,
        });
    }
});
exports.sendFriendRequest = sendFriendRequest;
const getPendingRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                message: "Authentication required",
            });
            return;
        }
        const requests = yield FriendRequestSchema_1.default.find({
            to: userId,
            status: "pending",
        }).populate("from", "name username profilePicture");
        res.status(200).json({
            message: "Pending friend requests fetched successfully",
            requests,
        });
    }
    catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({
            message: "Error fetching friend requests",
            error: error.message,
        });
    }
});
exports.getPendingRequests = getPendingRequests;
const handleFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const { action } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                message: "Authentication required",
            });
            return;
        }
        const friendRequest = yield FriendRequestSchema_1.default.findById(requestId);
        if (!friendRequest) {
            res.status(404).json({
                message: "No friend request found by this id",
            });
            return;
        }
        if (friendRequest.to.toString() !== userId) {
            res.status(400).json({
                message: "Not authorized to handle this request",
            });
            return;
        }
        if (friendRequest.status !== "pending") {
            res.status(403).json({
                message: "Request already handled",
            });
            return;
        }
        if (action === "accept") {
            yield Promise.all([
                FriendSchema_1.default.create({
                    user: friendRequest.from,
                    friend: friendRequest.to,
                }),
                FriendSchema_1.default.create({
                    user: friendRequest.to,
                    friend: friendRequest.from,
                }),
                FriendRequestSchema_1.default.findByIdAndUpdate(requestId, { status: "accepted" }),
            ]);
            res.status(200).json({
                message: "Friend request accepted",
            });
        }
        else if (action === "rejected") {
            yield FriendSchema_1.default.findByIdAndUpdate(requestId, { status: "rejected" });
            res.status(200).json({
                message: "Friend request rejected",
            });
        }
        else {
            res.status(400).json({
                message: "Invalid action. Use 'accept' or 'reject'",
            });
        }
    }
    catch (error) {
        console.error("Error handling friend request:", error);
        res.status(500).json({
            message: "Error handling friend request",
            error: error.message,
        });
    }
});
exports.handleFriendRequest = handleFriendRequest;
