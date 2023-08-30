import asyncHandler from "express-async-handler";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { envReader } from "../functions/functions";

exports.signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    console.log(req.file);

    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      res.status(400).json({ isSuccess: false });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          img: req.file
            ? `${envReader("SERVER_URL")}/avatars/${req.file.filename}`
            : `${envReader("SERVER_URL")}/avatars/default-avatar.jpeg`,
        });

        await user.save();
        res.json({ isSuccess: true });
      });
    }
  }
);

exports.signUpGoogle = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body", req.body);

    const opts: SignOptions = {};
    opts.expiresIn = 1000 * 60 * 60 * 24;
    const secret: Secret = envReader("SECRET_KEY");

    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      const token = await jwt.sign({ user }, secret, opts);
      res
        .status(200)
        .json({ token: `Bearer ${token}`, myId: user!._id, isSuccess: true });
      console.log("token", token);
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        img: req.body.img
          ? req.body.img
          : `${envReader("SERVER_URL")}/avatars/default-avatar.jpeg`,
      });
      console.log("user", user);

      await user.save();

      const token = await jwt.sign(
        {
          user: {
            name: user!.name,
            email: user!.email,
            img: user!.img,
            _id: user!._id,
          },
        },
        secret,
        opts
      );
      res.status(200).json({ token: `Bearer ${token}`, isSuccess: true });
      console.log("token", token);
    }
  }
);

exports.logIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.json({ invalid: { email: true, password: false } });
      next();
    }

    const match = await bcrypt.compare(password, user!.password!);

    if (!match) {
      res.json({ invalid: { password: true, email: false } });
      next();
    }

    const opts: SignOptions = {};
    opts.expiresIn = 1000 * 60 * 60 * 24;
    const secret: Secret = envReader("SECRET_KEY");
    const token = await jwt.sign(
      {
        user: {
          name: user!.name,
          email: user!.email,
          img: user!.img,
          _id: user!._id,
        },
      },
      secret,
      opts
    );

    res.status(200).json({ token: `Bearer ${token}`, myInfo: user });
  }
);

exports.getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await User.find({
      _id: { $ne: req.body._id },
    }).exec();

    res.json({ users: allUsers });
  }
);
