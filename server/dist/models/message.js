"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const MessageSchema = new mongoose_2.Schema({
    text: String,
    imageUrl: String,
    user: { type: mongoose_2.Schema.Types.ObjectId, ref: "User", required: true },
    date: Date,
    chat: { type: mongoose_2.Schema.Types.ObjectId, ref: "Chat", required: true },
    isRead: { type: Boolean, default: false },
});
exports.default = mongoose_1.default.model("Message", MessageSchema);
module.exports = mongoose_1.default.model("Message", MessageSchema);
