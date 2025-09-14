const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const bcrypt = require("bcrypt");
const { User } = require("../models");

// Admin dashboard
router.get("/dashboard", auth, role("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

//Admin and owner
router.get("reports", auth, role(["admin", "owner"]), (req, res) => {
  res.json({ message: "Reports for admin and owners", user: req.user });
});

// Admin: create a new user (admin/owner/user)
router.post("/create-user", auth, role("admin"), async (req, res) => {
  try {
    const { name, email, password, address, role: userRole } = req.body;

    if (!["admin", "owner", "user"].includes(userRole.toLowerCase())) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: userRole.toLowerCase(),
    });

    res.json({
      message: `User created with role ${newUser.role}`,
      userId: newUser.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Admin:  gets list of all the users
router.get("/users", auth, role("admin"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "address", "role", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
