import { Response } from "express";
import User from "../models/UserSchema";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import Friend from "../models/FriendSchema";
import FriendRequest from "../models/FriendRequestSchema";

interface RecommendationScore {
  userId: string;
  mutualFriends: number;
  commonInterests: number;
  totalScore: number;
}

export const getRecommendedFriends = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: "Authentication Required",
      });
      return;
    }

    const userFriends = await Friend.find({ user: userId }).select("friend");
    const friendIds = userFriends.map((f) => f.friend.toString());

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const existingRequests = await FriendRequest.find({
      $or: [{ from: userId }, { to: userId }],
    });

    const requestUserIds = existingRequests
      .map((r) => [r.from.toString(), r.to.toString()])
      .flat();

    const potentialFriends = await User.find({
      _id: {
        $nin: [userId, ...friendIds, ...requestUserIds],
      },
    }).select("_id username name profilePicture interests");

    const recommendations: RecommendationScore[] = await Promise.all(
      potentialFriends.map(async (user) => {
        const userFriends = await Friend.find({ user: user._id }).select(
          "friend"
        );
        const usersFriendIds = userFriends.map((f) => f.friend.toString());
        const mutualFriends = friendIds.filter((id) =>
          usersFriendIds.includes(id)
        ).length;

        const commonInterests = user.interests.filter((interest) =>
          currentUser.interests.includes(interest)
        ).length;

        const mutualFriendWeight = 2;
        const commonInterestWeight = 1;
        const totalScore =
          mutualFriends * mutualFriendWeight +
          commonInterests * commonInterestWeight;

        return {
          userId: user._id.toString(),
          mutualFriends,
          commonInterests,
          totalScore,
        };
      })
    );

    const sortedRecommendations = recommendations
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);

    const recommendedUsers = await Promise.all(
      sortedRecommendations.map(async (rec) => {
        const user = await User.findById(rec.userId).select(
          "username name profilePicture interests"
        );

        return {
          user,
          mutualFriends: rec.mutualFriends,
          commonInterests: rec.commonInterests,
          score: rec.totalScore,
        };
      })
    );

    res.status(200).json({
      message: "Friend recommendations fetched successfully",
      recommendations: recommendedUsers,
    });
  } catch (error: any) {
    console.error("Error getting friend recommendations:", error);
    res.status(500).json({
      message: "Error getting friend recommendations",
      error: error.message,
    });
  }
};

export const getMutualFriends = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { otherUserId } = req.params;

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const [userFriends, otherUserFriends] = await Promise.all([
      Friend.find({ user: userId }).select("friend"),
      Friend.find({ user: otherUserId }).select("friend"),
    ]);

    const userFriendIds = userFriends.map((f) => f.friend.toString());
    const otherUserFriendIds = otherUserFriends.map((f) => f.friend.toString());

    const mutualFriendIds = userFriendIds.filter((id) =>
      otherUserFriendIds.includes(id)
    );

    const mutualFriends = await User.find({
      _id: {
        $in: mutualFriendIds,
      },
    }).select("username name profilePicture");

    res.status(200).json({
      message: "Mutual friends fetched successfully",
      mutualFriends,
      count: mutualFriends.length,
    });
  } catch (error: any) {
    console.error("Error fetching mutual friends:", error),
      res.status(500).json({
        message: "Error while fetching mutual friends",
        error: error.message,
      });
  }
};
