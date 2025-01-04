import express from "express";
import cors from "cors";
import connectToDB from "./db/mongodb";
import authRoutes from "./routes/authRoutes";

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

app.listen(3000, () => {
  console.log(`Server started at ${3000}`);
});
