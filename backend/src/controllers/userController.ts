import express, { Request, Response } from "express";
import User from "../models/UserSchema";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({});

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error: any) {
    console.error("Error while fetching users:", error);
    res.status(500).json({
      message: "Erorr while fetching users",
      error: error.message,
    });
  }
};
