import asyncHandler from "express-async-handler";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { envReader } from "../functions/functions";
import jwtDecode from "jwt-decode";
import { DecodedJwt } from "../interfaces/interfaces";
import { use } from "passport";

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
        res.json({
          user: { _id: user._id, name: user.name, img: user.img },
          isSuccess: true,
        });
      });
    }
  }
);

exports.signUpGoogle = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const opts: SignOptions = {};
    opts.expiresIn = "3s";
    const secret: Secret = envReader("SECRET_KEY");

    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      const token = await jwt.sign({ user }, secret, opts);
      res
        .status(200)
        .json({ token: `Bearer ${token}`, myId: user!._id, isSuccess: true });
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
      res.status(200).json({
        token: `Bearer ${token}`,
        user: { name: user.name, _id: user._id, img: user.img },
        isSuccess: true,
      });
      console.log("token", token);
    }
  }
);

exports.logIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);

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
    opts.expiresIn = "3s";
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

    res.status(200).json({ token: `Bearer ${token}` });
  }
);

// exports.getAllUsers = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     console.log("header token", req.headers.authorization);

//     const decodedJwt = jwtDecode(
//       req.headers.authorization as string
//     ) as DecodedJwt;

//     const allUsers = await User.find({
//       _id: { $ne: decodedJwt.user._id },
//     }).exec();

//     res.json({ users: allUsers });
//   }
// );

exports.updateUserInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.body.id).exec();
    if (!user) {
      throw new Error("Couldn't find the user");
    }
    if (user) {
      req.body.name && (user.name = req.body.name);
      req.file &&
        (user.img = `${envReader("SERVER_URL")}/avatars/${req.file.filename}`);

      await user.save();

      const opts: SignOptions = {};
      opts.expiresIn = "100d";
      const secret: Secret = envReader("SECRET_KEY");
      const jwtToken = await jwt.sign(
        {
          user: {
            name: user.name,
            email: user.email,
            img: user.img,
            _id: user._id,
          },
        },
        secret,
        opts
      );

      res.status(200).json({ token: `Bearer ${jwtToken}` });
    }
  }
);

exports.getNewJwt = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedJwt: DecodedJwt = jwtDecode(
      req.headers.authorization as string
    );

    const opts: SignOptions = {};
    opts.expiresIn = "3s";
    const secret: Secret = envReader("SECRET_KEY");
    const jwtToken = await jwt.sign(
      {
        user: {
          name: decodedJwt.user.name,
          email: decodedJwt.user.email,
          img: decodedJwt.user.img,
          _id: decodedJwt.user._id,
        },
      },
      secret,
      opts
    );
    res.status(200).json({ token: `Bearer ${jwtToken}` });
  }
);
