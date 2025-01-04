import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import Friend from "../models/FriendSchema";
import FriendRequest from "../models/FriendRequestSchema";
import User from "../models/UserSchema";

export const sendFriendRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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

    const [toUser, fromUser] = await Promise.all([
      User.findById(to),
      User.findById(from),
    ]);

    if (!toUser || !fromUser) {
      res.status(404).json({
        message: "User not found...!",
      });
      return;
    }

    const existingRequest = await FriendRequest.findOne({
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

    const existingFriendShip = await Friend.findOne({
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

    const friendRequest = new FriendRequest({
      from,
      to,
      status: "pending",
    });

    await friendRequest.save();

    res.status(201).json({
      message: "Friend request sent successfully",
      request: friendRequest,
    });
  } catch (error: any) {
    console.error("Error sending friend request:", error);
    res.status(500).json({
      message: "Error sending friend request",
      error: error.message,
    });
  }
};

export const getPendingRequests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const requests = await FriendRequest.find({
      to: userId,
      status: "pending",
    }).populate("from", "name username profilePicture");

    res.status(200).json({
      message: "Pending friend requests fetched successfully",
      requests,
    });
  } catch (error: any) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({
      message: "Error fetching friend requests",
      error: error.message,
    });
  }
};

export const handleFriendRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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

    const friendRequest = await FriendRequest.findById(requestId);

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
      await Promise.all([
        Friend.create({
          user: friendRequest.from,
          friend: friendRequest.to,
        }),
        Friend.create({
          user: friendRequest.to,
          friend: friendRequest.from,
        }),
        FriendRequest.findByIdAndUpdate(requestId, { status: "accepted" }),
      ]);
      res.status(200).json({
        message: "Friend request accepted",
      });
    } else if (action === "rejected") {
      await Friend.findByIdAndUpdate(requestId, { status: "rejected" });

      res.status(200).json({
        message: "Friend request rejected",
      });
    } else {
      res.status(400).json({
        message: "Invalid action. Use 'accept' or 'reject'",
      });
    }
  } catch (error: any) {
    console.error("Error handling friend request:", error);
    res.status(500).json({
      message: "Error handling friend request",
      error: error.message,
    });
  }
};
