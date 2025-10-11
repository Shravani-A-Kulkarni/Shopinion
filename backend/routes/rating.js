const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

// Submit or update a rating
router.post("/:storeId", auth, role(["user", "admin"]), async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user.id;

    console.log("Incoming rating:", { userId, storeId, rating, reviewText });

    let sentimentLabel = null;
    let sentimentScore = null;

    if (reviewText && reviewText.trim() !== "") {
      const analysis = sentiment.analyze(reviewText);
      sentimentScore = analysis.score;
      sentimentLabel =
        analysis.score > 0
          ? "Positive"
          : analysis.score < 0
          ? "Negative"
          : "Neutral";
    }
    let userRating = await Rating.findOne({ where: { userId, storeId } });

    if (userRating) {
      console.log("Updating existing rating for user:", userId);
      userRating.rating = rating;
      userRating.reviewText = reviewText;
      userRating.sentimentLabel = sentimentLabel;
      userRating.sentimentScore = sentimentScore;
      await userRating.save();
    } else {
      console.log("Creating new rating for user:", userId);
      userRating = await Rating.create({
        userId,
        storeId,
        rating,
        reviewText,
        sentimentLabel,
        sentimentScore,
      });
    }
    console.log("Rating saved: ", userRating.toJSON());
    res.json({ message: "Rating submitted", rating: userRating });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
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
      order: [["createdAt", "DESC"]],
    });

    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;

    //Compute sentiment stattistics
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    let sentimentSum = 0;
    let sentimentCountForAvg = 0;

    ratings.forEach((r) => {
      const label = (r.sentimentLabel || "").toLowerCase();
      if (label === "positive") sentimentCounts.positive++;
      else if (label === "negative") sentimentCounts.negative++;
      else sentimentCounts.neutral++;

      if (r.sentimentScore !== null && r.sentimentScore !== undefined) {
        sentimentSum += parseFloat(r.sentimentScore) || 0;
        sentimentCountForAvg++;
      }
    });

    const avgSentimentScore =
      sentimentCountForAvg > 0 ? sentimentSum / sentimentCountForAvg : null;

    res.json({
      storeId: store.id,
      storeName: store.name,
      ratingsCount: ratings.length,
      averageRating: avg,
      ratings,
      sentimentCounts, // { positive, neutral, negative }
      avgSentimentScore, // numeric or null
      ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
