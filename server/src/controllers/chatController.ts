import asyncHandler from "express-async-handler";
import Chat from "../models/chat";
import Message from "../models/message";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

exports.getChat = asyncHandler(async (req: Request, res: Response) => {
  const { myId, userId } = req.body;
  const chat = await Chat.findOne({ users: [myId, userId] })
    .populate("messages")
    .exec();

  if (!chat) {
    const newChat = new Chat({
      users: [myId, userId],
      messages: [],
    });
    await newChat.save();
    res.status(200).json({ chat: newChat });
  } else {
    res.status(200).json(chat);
  }
});

exports.sendMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text, myId, date, chatId } = req.body;
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

    res.status(200).json({ isSuccess: true });
  }
);
