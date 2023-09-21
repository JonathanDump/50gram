"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const UserSchema = new mongoose_2.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    img: String,
    messages: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "Message", default: [] }],
    chats: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "Chat", default: [] }],
    googleId: String,
    lastOnline: Number,
    isVerified: { type: Boolean, default: false },
}, { collection: "Users" });
exports.default = mongoose_1.default.model("User", UserSchema);
module.exports = mongoose_1.default.model("User", UserSchema);
