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
    console.log("jwt_req", req);

    if (jwt_payload.user) {
      req.user = jwt_payload.user;
      return done(null, jwt_payload.user);
    }
    return done(null, false);
  })
);

module.exports = passport;
