import asyncHandler from "express-async-handler";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { envReader, generateJwt } from "../functions/functions";
import jwtDecode from "jwt-decode";
import { DecodedJwt, UserInterface } from "../interfaces/interfaces";
import { totp } from "otplib";
totp.options = { step: 60 };
import sendOtp from "../functions/sendOtp";
const nodemailer = require("nodemailer");

exports.signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    console.log(req.file);

    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      console.log("user exist");

      res.json({ isExist: true });
    } else {
      console.log("signing up the user");

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
    opts.expiresIn = "100d";
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
    opts.expiresIn = "100d";
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

exports.logInVerify = asyncHandler(
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

    const sendOtpResult = await sendOtp(email);

    if (!sendOtpResult) {
      res.status(400).json({ isSuccess: false });
      next();
    }
    res.status(200).json({ isSuccess: true });
  }
);

exports.otpVerify = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    console.log("verify otp", otp);

    const isValid = totp.check(otp, process.env.OTP_SECRET!);
    if (!isValid) {
      res.status(400).json({ invalidOtpToken: true });
      next();
    }

    const user = await User.findOne({ email }).exec();
    console.log("otpVerify", user);

    const jwtToken = await generateJwt(user, "100d");

    res.status(200).json({ token: `Bearer ${jwtToken}` });
  }
);

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
    opts.expiresIn = "100d";
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
