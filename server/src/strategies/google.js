const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const Image = require("../models/image");
const passport = require("passport");
const mongoose = require("mongoose");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/auth",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log("profile", profile);
      try {
        const userDb = await User.findOne({ googleId: profile.id }).exec();

        if (!userDb) {
          const img = new Image({
            _id: new mongoose.Types.ObjectId(),
            url: profile.photos[0].value,
          });

          const user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            img: img._id,
            password: "sdf",
          });
          await user.save();
          await img.save();

          return cb(null, user);
        } else {
          return cb(null, userDb);
        }
      } catch (err) {
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

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
