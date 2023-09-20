import { Server } from "socket.io";
import Message from "../models/message";
import Chat from "../models/chat";
import mongoose from "mongoose";
import {
  ISendMessage,
  ILoadMessages,
  IReadMessage,
} from "../interfaces/interfaces";
import message from "../models/message";
import { usersOnline } from "./socketHandlerUser";

export default function socketHandlerChat(io: Server) {
  io.on("connect", (socket) => {
    socket.on("join chat", (chatId: string, uId: string) => {
      

      socket.join(chatId);

      socket.to(chatId).emit("join chat", chatId, uId);
    });

    socket.on(
      "send message",
      async ({ text, imageUrl, myId, chatId, userId }: ISendMessage, cb) => {
        const chat = await Chat.findById(chatId).populate("messages").exec();
        

        if (!chat) {
          throw new Error("Couldn't find the chat");
        }

        const message = new Message({
          _id: new mongoose.Types.ObjectId(),
          text,
          imageUrl,
          user: myId,
          date: new Date(),
          chat: chatId,
        });

        chat!.messages.push(message._id);
        

        await message.save();
        await chat.save();

        const user = usersOnline.find((userIds) => userIds.userId === userId);
        if (user) {
          io.to(user.socketId).emit("get notification", myId);
        }
        cb(message);
        socket.to(chatId).emit("receive message", message);
      }
    );

    socket.on(
      "load messages",
      async ({ page, myId, userId }: ILoadMessages, cb) => {
        

        const pageSize = 100;
        const chat = await Chat.findOne({ users: { $all: [myId, userId] } })
          .populate({
            path: "messages",
            options: {
              sort: { date: -1 },
              skip: (+page - 1) * pageSize,
              limit: pageSize,
            },
          })
          .exec();
        cb(chat!.messages);
      }
    );

    socket.on("read message", async ({ messageId, chatId }: IReadMessage) => {
      const messageDb = await Message.findById(messageId);
      if (messageDb) {
        messageDb.isRead = true;
        await messageDb.save();

        socket.to(chatId).emit("read message", messageId);
      }
    });
  });
}
