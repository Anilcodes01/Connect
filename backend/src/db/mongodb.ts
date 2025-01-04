import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDB Connected...!");
  } catch (error: any) {
    console.error("Mongo Error:", error.message);
  }
};

export default connectToDB;