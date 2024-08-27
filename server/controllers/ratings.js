const express = require("express");
const Rating = require("../models/Rating");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userID, rating } = req.body;

    const user = await User.findOne({ kindeId: userID });

    if (!user) {
      console.log(8);
      return res.status(404).json({ msg: "User not found" });
    }

    let existingRating = await Rating.findOne({ user: user._id });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({
        rating: existingRating,
        msg: "You have updated you rating!",
      });
    } else {
      // Create a new rating
      const newRating = new Rating({ user: user._id, rating });
      await newRating.save();
      return res.json({ rating: newRating, msg: "Thanks for your rating!" });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const rating = await Rating.find();
    return res.json(rating);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await User.findOne({ kindeId: userID });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const rating = await Rating.findOne({ user: user._id });

    return res.json(rating);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
