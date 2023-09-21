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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const chat_1 = __importDefault(require("../models/chat"));
const user_1 = __importDefault(require("../models/user"));
const message_1 = __importDefault(require("../models/message"));
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const envReader_1 = __importDefault(require("../functions/envReader"));
exports.getChat = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedJwt = (0, jwt_decode_1.default)(req.headers.authorization);
    const myId = decodedJwt.user._id;
    const userId = req.params.userId;
    const pageSize = 100;
    const chat = yield chat_1.default.findOne({ users: { $all: [myId, userId] } })
        .populate({
        path: "users",
        select: ["name", "lastOnline"],
    })
        .populate({
        path: "messages",
        options: {
            sort: { date: -1 },
            skip: (+req.body.page - 1) * pageSize,
            limit: pageSize,
        },
    })
        .exec();
    if (!chat) {
        const users = yield user_1.default.find({
            _id: { $in: [myId, userId] },
        }, {
            name: 1,
            lastOnline: 1,
        }).exec();
        const newChat = new chat_1.default({
            users,
            messages: [],
        });
        yield newChat.save();
        res.status(200).json(newChat);
    }
    else {
        const messages = yield message_1.default.find({
            chat: chat._id,
            isRead: false,
            user: userId,
        });
        messages.forEach((msg) => __awaiter(void 0, void 0, void 0, function* () {
            msg.isRead = true;
            yield msg.save();
        }));
        chat.messages.forEach((message) => {
            if (message.user === userId) {
                message.isRead = true;
            }
        });
        res.status(200).json(chat);
    }
}));
exports.sendMessage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, myId, chatId } = req.body;
    const chat = yield chat_1.default.findById(chatId).populate("messages").exec();
    if (!chat) {
        throw new Error("Couldn't find the chat");
    }
    const message = new message_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        text,
        user: myId,
        date: new Date(),
        chat: chatId,
    });
    chat.messages.push(message._id);
    yield message.save();
    yield chat.save();
    res.status(200).json({ message, isSuccess: true });
}));
exports.sendImageMessage = (req, res, next) => {
    res.json({
        imageUrl: `${(0, envReader_1.default)("CORS_ORIGIN")}/pictures/${req.file.filename}`,
    });
};
