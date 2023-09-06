import { Server } from "socket.io";
import Message from "../models/message";
import Chat from "../models/chat";
import mongoose from "mongoose";

export default function socketHandlerChat(io: Server) {
  io.on("connect", (socket) => {
    console.log("connected to chat");

    // socket.on("get chat", async ({ userId, myId }, cb) => {
    //   console.log("userId", userId);
    //   console.log("myId", myId);

    //   let chat = await Chat.findOne({ users: { $all: [myId, userId] } })
    //     .populate("messages")
    //     .exec();
    //   console.log("chat", chat);

    //   if (!chat) {
    //     chat = new Chat({
    //       users: [myId, userId],
    //       messages: [],
    //     });
    //     await chat.save();
    //   }
    //   cb({
    //     status: "ok",
    //     chat,
    //   });
    //   //   socket.emit("get chat", chat);
    // });

    socket.on("send message", async ({ text, myId, chatId }, cb) => {
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
      console.log("msg", message);

      await message.save();
      await chat.save();

      cb(message);
      socket.broadcast.emit("receive message", message);
    });
  });
}
