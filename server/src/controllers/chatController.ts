import asyncHandler from "express-async-handler";
import Chat from "../models/chat";
import express, { Request, Response, NextFunction } from "express";

exports.getChat = asyncHandler(async (req: Request, res: Response) => {
  const { myId, userId } = req.body.myId;
  const chat = await Chat.findOne({ users: [myId, userId] })
    .populate("messages")
    .exec();

  if (!chat) {
    const newChat = new Chat({
      users: [myId, userId],
      messages: [],
    });
    await newChat.save();
    res.status(200).json({ messages: newChat.messages });
  } else {
    res.status(200).json({ messages: chat.messages });
  }
});
