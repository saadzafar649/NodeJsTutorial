const express = require("express");
const router = express.Router();

const User = require("../model/User");
const LoginHistory = require("../model/history");
const { Op } = require("sequelize");

router.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Please provide email" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) return res.status(404).json({ error: "User not found" });


    await LoginHistory.create({
      user_id: existingUser.id,
      type: "login",
    });

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    return res.status(500).json({ error: err});
  }
});

router.post("/logout", async (req, res) => {
  const { email } = req.body;

  if (!email) 
    return res.status(422).json({ error: "email is required for logout" });
  

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) return res.status(404).json({ error: "User not found" });

    await LoginHistory.create({
      user_id: existingUser.id,
      type: "logout",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
