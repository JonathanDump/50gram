import { Server } from "socket.io";
import Message from "../models/message";
import Chat from "../models/chat";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import { envReader } from "../functions/functions";
import { writeFile } from "fs";
import { ISendMessage, ILoadMessages } from "../interfaces/interfaces";

export default function socketHandlerChat(io: Server) {
  // io.use((socket, next) => {
  //   if (socket.handshake.headers.authorization) {
  //     const token = socket.handshake.headers.authorization.split(" ")[1];
  //     console.log("token", token);

  //     jwt.verify(token, envReader("SECRET_KEY"), function (err, decoded) {
  //       console.log("decoded");

  //       if (err) {
  //         console.log("err", err);

  //         return next(new Error("Authentication error"));
  //       }

  //       next();
  //     });
  //   } else {
  //     next(new Error("Authentication error"));
  //   }
  // });

  io.on("connect", (socket) => {
    // console.log("connected to chat");

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

    socket.on("join chat", (chatId) => {
      console.log("joining room", chatId);

      socket.join(chatId);
    });

    socket.on(
      "send message",
      async ({ text, imageUrl, myId, chatId }: ISendMessage, cb) => {
        const chat = await Chat.findById(chatId).populate("messages").exec();
        console.log("send message");

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
        console.log("msg", message);

        await message.save();
        await chat.save();

        cb(message);
        socket.to(chatId).emit("receive message", message);
      }
    );

    socket.on(
      "load messages",
      async ({ page, myId, userId }: ILoadMessages, cb) => {
        console.log("load msg page", page);

        const pageSize = 100;
        const chat = await Chat.findOne({ users: { $all: [myId, userId] } })
          .populate({
            path: "messages",
            options: {
              sort: { date: -1 },
              skip: (+page - 1) * pageSize, // Calculate the number of messages to skip
              limit: pageSize, // Limit the number of messages per page
            },
          })
          .exec();
        cb(chat!.messages);
      }
    );
  });
}
