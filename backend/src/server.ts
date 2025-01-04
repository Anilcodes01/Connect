import express from "express";
import cors from "cors";
import connectToDB from "./db/mongodb";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import friendRoutes from "./routes/friendRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";

connectToDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api", recommendationRoutes);

app.listen(6001, () => {
  console.log(`Server started at ${6001}`);
});
