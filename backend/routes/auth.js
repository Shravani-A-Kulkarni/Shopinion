const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Sequelize User model
const auth = require("../middleware/auth");
require("dotenv").config();

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
      finalRole = role.toLowerCase(); // ✅ use "role", not "userRole"
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

module.exports = router;
