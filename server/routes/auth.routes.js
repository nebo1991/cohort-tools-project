const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/JWTauthentication");
require("dotenv").config();

const authRouter = express.Router();
const saltRounds = 10;

// POST  /auth/signup
// POST  /auth/signup
authRouter.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      res.status(400).json({ message: "Provide email, password and name" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      console.log(foundUser);
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    next(error); // Remove res.status(500).json(...) here
  }
});

// POST  /auth/login
authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(400).json({ message: "Wrong credentials." });
      return;
    }

    const isPasswordMatch = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Wrong credentials." });
      return;
    }

    const { _id, name } = foundUser;
    const payload = { _id, email, name };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken: authToken });
  } catch (error) {
    console.error(error);
    next(error); // Remove res.status(500).json(...) here
  }
});
// ...

// GET  /auth/verify
authRouter.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json({ loggedIn: true });
});

// ...

module.exports = authRouter;
