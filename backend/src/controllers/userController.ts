import express, { Request, Response } from "express";
import User from "../models/UserSchema";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
   
    const loggedInUserId = req.userId 

    const users = await User.find({ _id: { $ne: loggedInUserId } });

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error: any) {
    console.error("Error while fetching users:", error);
    res.status(500).json({
      message: "Error while fetching users",
      error: error.message,
    });
  }
};


export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const searchTerm = req.query.username as string;

    if (!searchTerm) {
      res.status(200).json({
        message: "Please provide a search term",
        users: [],
      });
      return;
    }

    const searchRegex = new RegExp(searchTerm, "i");

    const users = await User.find({
      username: { $regex: searchRegex },
    })
      .select("-password")
      .limit(10);

    res.status(200).json({
      message: "Users found successfully",
      users,
    });
  } catch (error: any) {
    console.error("Error while searching users...");
    res.status(500).json({
      message: "Error while searching users...!",
      error: error.message,
    });
    return;
  }
};
