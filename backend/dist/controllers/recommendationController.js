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
exports.getMutualFriends = exports.getRecommendedFriends = void 0;
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const FriendSchema_1 = __importDefault(require("../models/FriendSchema"));
const FriendRequestSchema_1 = __importDefault(require("../models/FriendRequestSchema"));
const getRecommendedFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                message: "Authentication Required",
            });
            return;
        }
        const userFriends = yield FriendSchema_1.default.find({ user: userId }).select("friend");
        const friendIds = userFriends.map((f) => f.friend.toString());
        const currentUser = yield UserSchema_1.default.findById(userId);
        if (!currentUser) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        const existingRequests = yield FriendRequestSchema_1.default.find({
            $or: [{ from: userId }, { to: userId }],
        });
        const requestUserIds = existingRequests
            .map((r) => [r.from.toString(), r.to.toString()])
            .flat();
        const potentialFriends = yield UserSchema_1.default.find({
            _id: {
                $nin: [userId, ...friendIds, ...requestUserIds],
            },
        }).select("_id username name profilePicture interests");
        const recommendations = yield Promise.all(potentialFriends.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const userFriends = yield FriendSchema_1.default.find({ user: user._id }).select("friend");
            const usersFriendIds = userFriends.map((f) => f.friend.toString());
            const mutualFriends = friendIds.filter((id) => usersFriendIds.includes(id)).length;
            const commonInterests = user.interests.filter((interest) => currentUser.interests.includes(interest)).length;
            const mutualFriendWeight = 2;
            const commonInterestWeight = 1;
            const totalScore = mutualFriends * mutualFriendWeight +
                commonInterests * commonInterestWeight;
            return {
                userId: user._id.toString(),
                mutualFriends,
                commonInterests,
                totalScore,
            };
        })));
        const sortedRecommendations = recommendations
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10);
        const recommendedUsers = yield Promise.all(sortedRecommendations.map((rec) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UserSchema_1.default.findById(rec.userId).select("username name profilePicture interests");
            return {
                user,
                mutualFriends: rec.mutualFriends,
                commonInterests: rec.commonInterests,
                score: rec.totalScore,
            };
        })));
        res.status(200).json({
            message: "Friend recommendations fetched successfully",
            recommendations: recommendedUsers,
        });
    }
    catch (error) {
        console.error("Error getting friend recommendations:", error);
        res.status(500).json({
            message: "Error getting friend recommendations",
            error: error.message,
        });
    }
});
exports.getRecommendedFriends = getRecommendedFriends;
const getMutualFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { otherUserId } = req.params;
        if (!userId) {
            res.status(401).json({
                message: "Authentication required",
            });
            return;
        }
        const [userFriends, otherUserFriends] = yield Promise.all([
            FriendSchema_1.default.find({ user: userId }).select("friend"),
            FriendSchema_1.default.find({ user: otherUserId }).select("friend"),
        ]);
        const userFriendIds = userFriends.map((f) => f.friend.toString());
        const otherUserFriendIds = otherUserFriends.map((f) => f.friend.toString());
        const mutualFriendIds = userFriendIds.filter((id) => otherUserFriendIds.includes(id));
        const mutualFriends = yield UserSchema_1.default.find({
            _id: {
                $in: mutualFriendIds,
            },
        }).select("username name profilePicture");
        res.status(200).json({
            message: "Mutual friends fetched successfully",
            mutualFriends,
            count: mutualFriends.length,
        });
    }
    catch (error) {
        console.error("Error fetching mutual friends:", error),
            res.status(500).json({
                message: "Error while fetching mutual friends",
                error: error.message,
            });
    }
});
exports.getMutualFriends = getMutualFriends;
