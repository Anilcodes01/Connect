"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./db/mongodb"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const friendRoutes_1 = __importDefault(require("./routes/friendRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
(0, mongodb_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api", userRoutes_1.default);
app.use("/api/friend", friendRoutes_1.default);
app.use("/api", recommendationRoutes_1.default);
app.listen(6001, () => {
    console.log(`Server started at ${6001}`);
});
