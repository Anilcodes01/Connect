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
exports.searchUsers = exports.getUsers = void 0;
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = req.userId;
        const users = yield UserSchema_1.default.find({ _id: { $ne: loggedInUserId } });
        res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    }
    catch (error) {
        console.error("Error while fetching users:", error);
        res.status(500).json({
            message: "Error while fetching users",
            error: error.message,
        });
    }
});
exports.getUsers = getUsers;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.username;
        if (!searchTerm) {
            res.status(200).json({
                message: "Please provide a search term",
                users: [],
            });
            return;
        }
        const searchRegex = new RegExp(searchTerm, "i");
        const users = yield UserSchema_1.default.find({
            username: { $regex: searchRegex },
        })
            .select("-password")
            .limit(10);
        res.status(200).json({
            message: "Users found successfully",
            users,
        });
    }
    catch (error) {
        console.error("Error while searching users...");
        res.status(500).json({
            message: "Error while searching users...!",
            error: error.message,
        });
        return;
    }
});
exports.searchUsers = searchUsers;
