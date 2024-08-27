const express = require("express");
const User = require("../models/User");
const router = express.Router();

// get By id
router.get("/id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Failed to get user", error: e.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { familyName, givenName, username, email, isAdmin, _id } = req.body;

    const existingUser = await User.findOne({ kindeId: _id });
    if (existingUser) {
      return;
    }

    const newUser = new User({
      familyName,
      givenName,
      username,
      email,
      isAdmin,
      kindeId: _id,
    });

    await newUser.save();

    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.get("/kindeID/:id", async (req, res) => {
  try {
    const user = await User.findOne({ kindeId: req.params.id });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// get all
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
