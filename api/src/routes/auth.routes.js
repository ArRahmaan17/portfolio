const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.scope("withPassword").findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Your Credentials are missmatch with our records",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jsonwebtoken.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const safeUser = user.get({ plain: true });
    delete safeUser.password;

    return res.status(200).json({ message: "Login successful", user: safeUser, token: token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
