import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import envReader from "../functions/envReader";
import jwtDecode from "jwt-decode";
import { DecodedJwt } from "../interfaces/interfaces";
import { totp } from "otplib";
import sendOtp from "../functions/sendOtp";
import generateJwt from "../functions/generateJwt";
import { cloudinary } from "../config/config";
import { UploadApiResponse } from "cloudinary";

totp.options = { step: 60 };

exports.signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      res.json({ isExist: true });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        let uploadResult: UploadApiResponse | undefined;
        if (req.file) {
          await cloudinary.uploader.upload(req.file.path, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              uploadResult = result;
            }
          });
        }

        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          img: uploadResult?.url || "",
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
    }
  }
);

exports.logInVerify = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.json({ invalid: { email: true, password: false } });
      return next();
    }

    const match = await bcrypt.compare(password, user!.password!);

    if (!match) {
      res.json({ invalid: { password: true, email: false } });
      return next();
    }

    if (user.email === "test@test.com") {
      const token = await generateJwt(user);
      res.json({ token: `Bearer ${token}` });
      return next();
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

    const isValid = totp.check(otp, process.env.OTP_SECRET!);
    if (!isValid) {
      res.status(400).json({ invalidOtpToken: true });
      next();
    }

    const user = await User.findOne({ email }).exec();

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
