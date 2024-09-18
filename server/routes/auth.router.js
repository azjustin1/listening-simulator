// userRouter.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("dotenv").config();

const router = express.Router();

router.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    if (req.user) {
      return res.status(200).send(true);
    } else {
      return res.status(401).json({ loggedIn: false });
    }
  },
);

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: { username },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route to authenticate user and generate token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({ accessToken: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
