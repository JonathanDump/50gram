import asyncHandler from "express-async-handler";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

exports.SignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

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
      res.json({ msg: "registered" });
    });
  }
);
