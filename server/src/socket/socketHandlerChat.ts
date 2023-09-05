import { Server } from "socket.io";
import Message from "../models/message";
import Chat from "../models/chat";
import mongoose from "mongoose";

export default function socketHandlerChat(io: Server) {
  io.on("connect", (socket) => {
    console.log("connected to chat");

    socket.on("get chat", async ({ userId, myId }) => {
      console.log("userId", userId);
      console.log("myId", myId);

      let chat = await Chat.findOne({ users: [myId, userId] })
        .populate("messages")
        .exec();
      console.log("chat", chat);

      if (!chat) {
        chat = new Chat({
          users: [myId, userId],
          messages: [],
        });
        await chat.save();
      }
      socket.emit("receive chat", chat);
    });

    socket.on("send message", async ({ text, myId, chatId }) => {
      const chat = await Chat.findById(chatId).populate("messages").exec();

      if (!chat) {
        throw new Error("Couldn't find the chat");
      }

      const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        text,
        user: myId,
        date: new Date(),
        chat: chatId,
      });

      chat!.messages.push(message._id);

      await message.save();
      await chat.save();

      socket.broadcast.emit("receive message", message);
    });
  });
}
