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
exports.usersOnline = void 0;
const user_1 = __importDefault(require("../models/user"));
const chat_1 = __importDefault(require("../models/chat"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
exports.usersOnline = [];
function socketHandlerUser(io) {
    io.on("connect", (socket) => {
        if (!socket.handshake.auth.token) {
            socket.emit("invalid token");
        }
        if (socket.handshake.auth.token) {
            const decodedJwt = (0, jwt_decode_1.default)(socket.handshake.auth.token);
            const userIds = { socketId: socket.id, userId: decodedJwt.user._id };
            exports.usersOnline.find((user) => user.userId === userIds.userId) ||
                exports.usersOnline.push(userIds);
            io.emit("online", exports.usersOnline);
        }
        socket.on("getAllUsers", (myId) => __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield user_1.default.find({
                _id: { $ne: myId },
            })
                .select("id name img isVerified")
                .exec();
            const populateChatsWithUnreadMessages = (user, myId) => __awaiter(this, void 0, void 0, function* () {
                const populatedChat = yield chat_1.default.findOne({
                    users: { $all: [myId, user._id] },
                })
                    .populate({
                    path: "messages",
                    match: { isRead: false, user: user._id },
                    select: "id",
                })
                    .exec();
                return Object.assign(Object.assign({}, user.toObject()), { newMessages: (populatedChat === null || populatedChat === void 0 ? void 0 : populatedChat.messages.length) || 0 });
            });
            const usersWithPopulatedChat = yield Promise.all(allUsers.map((user) => populateChatsWithUnreadMessages(user, myId)));
            socket.emit("allUsers", usersWithPopulatedChat);
        }));
        socket.on("signUpUser", (user) => {
            socket.broadcast.emit("updateUserList", user);
        });
        socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const disconnectedUser = exports.usersOnline.filter((user) => user.socketId === socket.id);
            const userDb = yield user_1.default.findById((_a = disconnectedUser[0]) === null || _a === void 0 ? void 0 : _a.userId);
            if (userDb) {
                userDb.lastOnline = Date.now();
                yield userDb.save();
                socket.broadcast.emit("disconnected user", {
                    _id: userDb._id,
                    name: userDb.name,
                    lastOnline: userDb.lastOnline,
                });
            }
            exports.usersOnline = exports.usersOnline.filter((user) => user.socketId !== socket.id);
            io.emit("disconnected", exports.usersOnline);
            socket.emit("disconnect user");
        }));
    });
}
exports.default = socketHandlerUser;
