const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;
  const saltRounds = 10;

  try {
    if (!email || !password || !name) {
      res.status(400).json({ message: "All inputs are required." });
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
    res.status(500).json({ error: `${error}` });
  }
});

module.exports = authRouter;
