const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Owner/Admin: Get all stores with ratings summary
router.get(
  "/stores/ratings",
  auth,
  role(["owner", "admin"]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // If admin → fetch all stores
      // If owner → fetch only their stores
      const whereCondition = userRole === "owner" ? { ownerId: userId } : {};

      const stores = await Store.findAll({
        where: whereCondition,
        include: [
          {
            model: Rating,
            as: "ratings",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"],
              },
            ],
          },
        ],
      });

      const result = stores.map((store) => {
        const ratings = store.ratings || [];
        const avg =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : null;

        return {
          storeId: store.id,
          storeName: store.name,
          ratingsCount: ratings.length,
          averageRating: avg,
          ratings,
        };
      });

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// Owner: update password
router.put("/update-password", auth, role("owner"), async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both old and new passwords are required" });
    }

    const user = await User.findByPk(req.user.id);

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
