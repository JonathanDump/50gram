import asyncHandler from "express-async-handler";
import Chat from "../models/chat";
import User from "../models/user";
import Message from "../models/message";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwtDecode from "jwt-decode";
import { DecodedJwt } from "../interfaces/interfaces";
import { envReader } from "../functions/functions";

exports.getChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("page", req.body.page);

    const decodedJwt = jwtDecode(
      req.headers.authorization as string
    ) as DecodedJwt;
    const myId = decodedJwt.user._id;
    const userId = req.params.userId;

    const pageSize = 100;
    const chat = await Chat.findOne({ users: { $all: [myId, userId] } })
      .populate({
        path: "users",
        select: ["name", "lastOnline"],
      })
      .populate({
        path: "messages",
        options: {
          sort: { date: -1 },
          skip: (+req.body.page - 1) * pageSize, // Calculate the number of messages to skip
          limit: pageSize, // Limit the number of messages per page
        },
      })
      .exec();
    console.log("chat", chat);

    if (!chat) {
      const users = await User.find(
        {
          _id: { $in: [myId, userId] }, // Use $in to match both myId and userId
        },
        {
          name: 1,
          lastOnline: 1,
        }
      ).exec();

      const newChat = new Chat({
        users,
        messages: [],
      });
      await newChat.save();
      console.log("new chat", newChat);

      res.status(200).json(newChat);
    } else {
      const messages = await Message.find({
        chat: chat._id,
        isRead: false,
        user: userId,
      });

      messages.forEach(async (msg) => {
        msg.isRead = true;
        await msg.save();
      });
      console.log("umread messages", await messages);

      chat.messages.forEach((message: any) => (message.isRead = true));

      res.status(200).json(chat);
    }
  }
);

exports.sendMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text, myId, chatId } = req.body;
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

    res.status(200).json({ message, isSuccess: true });
  }
);

exports.sendImageMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({
    imageUrl: `${envReader("SERVER_URL")}/pictures/${req.file!.filename}`,
  });
};
