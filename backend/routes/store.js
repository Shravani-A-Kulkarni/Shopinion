const express = require("express");
const router = express.Router();
const { Store, Rating } = require("../models");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Admin: create store
router.post("/", auth, role("admin"), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Any logged-in user: get list of stores
router.get("/", auth, async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Owners can updated their store details
router.put("/:storeId", auth, role(["owner", "admin"]), async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, email, address } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (userRole === "owner" && store.ownerId != userId) {
      return res.status(403).json({ error: "Forbidden : not your store" });
    }

    //update fields
    store.name = name || store.name;
    store.email = email || store.email;
    store.address = address || store.address;

    await store.save();
    res.json({ message: "Store updated", store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get store details with average rating & user’s rating
router.get("/:storeId/details", auth, async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    // Fetch all ratings for this store
    const ratings = await Rating.findAll({ where: { storeId } });

    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;

    const userRating = ratings.find((r) => r.userId === userId);

    res.json({
      storeId: store.id,
      storeName: store.name,
      address: store.address,
      averageRating: avg,
      userRating: userRating ? userRating.rating : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
