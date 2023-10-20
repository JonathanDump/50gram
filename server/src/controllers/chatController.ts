import asyncHandler from "express-async-handler";
import Chat from "../models/chat";
import User from "../models/user";
import Message from "../models/message";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwtDecode from "jwt-decode";
import { DecodedJwt } from "../interfaces/interfaces";
import envReader from "../functions/envReader";
import { cloudinary } from "../config/config";
import { UploadApiResponse } from "cloudinary";

exports.getChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
          skip: (+req.body.page - 1) * pageSize,
          limit: pageSize,
        },
      })
      .exec();

    if (!chat) {
      const users = await User.find(
        {
          _id: { $in: [myId, userId] },
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

      chat.messages.forEach((message: any) => {
        if (message.user === userId) {
          message.isRead = true;
        }
      });

      res.status(200).json(chat);
    }
  }
);

exports.sendImageMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      await cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          res.json({ imageUrl: result?.url });
        }
      });
    }
  }
);
