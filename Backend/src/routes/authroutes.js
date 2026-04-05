const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/authmodel");
require("dotenv").config();
 
const router = express.Router();


// 🔹 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Logout failed" });
    }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token,{
        httpOnly: true,
        secure: true,        // MUST
        sameSite: "None"    ,
          path: "/"
   // ✅ VERY IMPORTANT
} );
    
     res.status(200).json({
      msg: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;