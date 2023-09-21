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
const message_1 = __importDefault(require("../models/message"));
const chat_1 = __importDefault(require("../models/chat"));
const mongoose_1 = __importDefault(require("mongoose"));
const socketHandlerUser_1 = require("./socketHandlerUser");
function socketHandlerChat(io) {
    io.on("connect", (socket) => {
        socket.on("join chat", (chatId, uId) => {
            socket.join(chatId);
            socket.to(chatId).emit("join chat", chatId, uId);
        });
        socket.on("send message", ({ text, imageUrl, myId, chatId, userId }, cb) => __awaiter(this, void 0, void 0, function* () {
            const chat = yield chat_1.default.findById(chatId).populate("messages").exec();
            if (!chat) {
                throw new Error("Couldn't find the chat");
            }
            const message = new message_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                text,
                imageUrl,
                user: myId,
                date: new Date(),
                chat: chatId,
            });
            chat.messages.push(message._id);
            yield message.save();
            yield chat.save();
            const user = socketHandlerUser_1.usersOnline.find((userIds) => userIds.userId === userId);
            if (user) {
                io.to(user.socketId).emit("get notification", myId);
            }
            cb(message);
            socket.to(chatId).emit("receive message", message);
        }));
        socket.on("load messages", ({ page, myId, userId }, cb) => __awaiter(this, void 0, void 0, function* () {
            const pageSize = 100;
            const chat = yield chat_1.default.findOne({ users: { $all: [myId, userId] } })
                .populate({
                path: "messages",
                options: {
                    sort: { date: -1 },
                    skip: (+page - 1) * pageSize,
                    limit: pageSize,
                },
            })
                .exec();
            cb(chat.messages);
        }));
        socket.on("read message", ({ messageId, chatId }) => __awaiter(this, void 0, void 0, function* () {
            const messageDb = yield message_1.default.findById(messageId);
            if (messageDb) {
                messageDb.isRead = true;
                yield messageDb.save();
                socket.to(chatId).emit("read message", messageId);
            }
        }));
    });
}
exports.default = socketHandlerChat;
