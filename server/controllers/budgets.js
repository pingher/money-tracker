const express = require("express");
const Budget = require("../models/Budget");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { category, amount, timeline, userID } = req.body;
    console.log(req.body);

    const user = await User.findOne({ kindeId: userID });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const budget = await Budget.create({
      category,
      amount,
      timeline,
      user: user._id,
    });

    return res.json({ budget, msg: "Budget Added Successfully!" });
  } catch (e) {
    console.error("Error adding record:", e);
    return res.status(400).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const budget = await Budget.find();
    return res.json(budget);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/userID/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await User.findOne({ kindeId: userID });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const budget = await Budget.find({ user: user._id }).populate("category");

    return res.json(budget);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
