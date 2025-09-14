const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Submit or update a rating
router.post("/:storeId", auth, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    console.log("Incoming rating:", { userId, storeId, rating });

    let userRating = await Rating.findOne({ where: { userId, storeId } });

    if (userRating) {
      console.log("Updating existing rating for user:", userId);
      userRating.rating = rating;
      await userRating.save();
    } else {
      console.log("Creating new rating for user:", userId);
      userRating = await Rating.create({ userId, storeId, rating });
    }

    res.json({ message: "Rating submitted", rating: userRating });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message }); // ✅ fixed typo
  }
});

// Get all ratings for a store + average
router.get("/:storeId", auth, role(["owner", "admin"]), async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // If logged-in user is owner, ensure they own this store
    if (userRole === "owner" && store.ownerId !== userId) {
      return res.status(403).json({ error: "Forbidden: not your store" });
    }

    // Fetch ratings with user details
    const ratings = await Rating.findAll({
      where: { storeId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;

    res.json({
      storeId: store.id,
      storeName: store.name,
      ratingsCount: ratings.length,
      averageRating: avg,
      ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
