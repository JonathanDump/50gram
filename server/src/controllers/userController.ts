import asyncHandler from "express-async-handler";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { envReader } from "../functions/functions";

exports.signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
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
        });

        await user.save();
        res.json({ isSuccess: true });
      });
    }
  }
);

exports.logIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.status(403).json({ invalidEmail: true });
      next();
    }

    const match = await bcrypt.compare(password, user!.password);

    if (!match) {
      res.status(403).json({ invalidPassword: true });
      next();
    }

    const opts: SignOptions = {};
    opts.expiresIn = 1000 * 60 * 60 * 24;
    const secret: Secret = envReader("SECRET_KEY");
    const token = await jwt.sign({ userId: user!._id }, secret, opts);
    console.log("token", token);
    res.status(200).json({ token: `Bearer ${token}` });
  }
);
