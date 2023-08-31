const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(opts, async (req, jwt_payload, done) => {
    console.log(jwt_payload.user);
    console.log("body in jwt", req.body);
    if (jwt_payload.user) {
      console.log("auth success");
      return done(null, true);
    }
    console.log("auth fail");
    return done(null, false);
  })
);

module.exports = passport;
