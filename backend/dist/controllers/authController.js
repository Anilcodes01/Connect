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
exports.login = exports.signup = void 0;
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, password } = req.body;
    try {
        if (!name || !email || !password || !username) {
            res.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const existingUser = yield UserSchema_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "Email already exists",
            });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new UserSchema_1.default({
            name,
            email,
            password: hashedPassword,
            username,
        });
        yield newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            },
        });
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            message: "Server error during signup",
            error: error.message,
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield UserSchema_1.default.findOne({ email });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({
            message: "User logged in successfully",
            token,
        });
    }
    catch (error) {
        console.error("Error while logging in:", error);
        res.status(500).json({
            message: "Error while logging in...!",
            error: error.message,
        });
    }
});
exports.login = login;
