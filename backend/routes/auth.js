const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, PasswordResetToken } = require("../models/index.js"); // Sequelize User model
const auth = require("../middleware/auth");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

// Signup (register new user)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only allow "owner" or "user" roles from signup
    let finalRole = "user"; // default
    if (role && ["owner", "user"].includes(role.toLowerCase())) {
      finalRole = role.toLowerCase(); // use "role", not "userRole"
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: finalRole,
    });

    res.json({
      message: "User created successfully",
      userId: newUser.id,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "address"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Loged in user can update the password
router.put("/update-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json("user not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json("Old password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json("Password updated successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json("User not found!");

    //Generate raw token
    const rawToken = crypto.randomBytes(32).toString("hex");
    console.log(rawToken);

    //Save hashed token in db
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await PasswordResetToken.create({
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), //15 min
      used: false,
    });
    const resetLink = `http://localhost:3000/reset-password/${rawToken}`;

    //Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}"> here </a>to reset your password. This link is valid for 15 min only.</p>`,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    //verify token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetRecord = await PasswordResetToken.findOne({
      where: { token: hashedToken },
    });

    if (!resetRecord) return res.status(400).json({ error: "Invalid token" });
    if (resetRecord.used)
      return res.status(400).json({ error: "Token already used" });
    if (resetRecord.expiresAt < new Date())
      return res.status(400).json({ error: "Token expired" });

    const user = await User.findByPk(resetRecord.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    //Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    resetRecord.used = true;
    await resetRecord.save();
    console.log("Password reset for user: ", user.email);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ error: "Something went wrong." });
  }
});

//Delete an account
router.delete("/delete-account", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
