// const GoogleStrategy = require("passport-google-oauth20").Strategy;
import User from "../models/user";
import { Profile, VerifyCallback } from "passport-google-oauth20";
import Image from "../models/image";
import { VerifiedCallback } from "passport-jwt";
import { UserInterface } from "../interfaces/interfaces";
import passport from "passport";
import mongoose from "mongoose";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { StrategyOptions } from "passport-google-oauth20";
import { envReader } from "../functions/functions";
// import GoogleStrategy from 'passport-google-oauth20'
// const passport = require("passport");
// const mongoose = require("mongoose");

passport.use(
  new GoogleStrategy(
    {
      clientID: envReader("GOOGLE_CLIENT_ID"),
      clientSecret: envReader("GOOGLE_CLIENT_SECRET"),
      callbackURL: "http://localhost:3000/google/auth",
      scope: ["profile", "email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: VerifyCallback
    ) => {
      console.log("profile", profile);
      try {
        if (!profile.emails) {
          throw new Error("Something went wrong");
        }

        const userDb = await User.findOne({ googleId: profile.id }).exec();

        if (!userDb) {
          const img = profile.photos
            ? new Image({
                _id: new mongoose.Types.ObjectId(),
                url: profile.photos[0].value,
              })
            : undefined;

          const user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            img: img?._id,
            password: "sdf",
          });

          await user.save();
          img && (await img.save());

          return cb(null, user);
        } else {
          return cb(null, userDb);
        }
      } catch (err: any) {
        return cb(err);
      }
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/google/auth",
//       scope: ["profile"],
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       console.log("profile", profile);
//       return cb(null, profile);
//     }
//   )
// );

passport.serializeUser((user: Express.User, done: VerifiedCallback) => {
  done(null, user);
});
passport.deserializeUser((user: UserInterface, done: VerifyCallback) => {
  done(null, user);
});
