// passportConfig.js
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user.model");
const path = require("path"); // Import your user model
const passport = require("passport");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from cookies
  secretOrKey: process.env.JWT_SECRET,
};

const strategy = new Strategy(opts, async (jwtPayload, done) => {
  try {
    console.log(jwtPayload);
    const user = await User.findOne({ username: jwtPayload.username });
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

module.exports = (passport) => {
  passport.use(strategy);
};
