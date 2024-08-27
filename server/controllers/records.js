const express = require("express");
const Record = require("../models/Record");
const router = express.Router();
const User = require("../models/User");

// Add New
router.post("/", async (req, res) => {
  try {
    const { category, amount, date, details, userID } = req.body;

    const user = await User.findOne({ kindeId: userID });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!category || !amount || !date) {
      console.log("err");
      return res
        .status(400)
        .json({ error: "Please fill up all required fields." });
    }

    const record = await Record.create({
      category,
      amount: parseInt(amount),
      date: new Date(date),
      details,
      user: user._id,
    });

    return res.json({ record, msg: "Record Added Successfully!" });
  } catch (e) {
    console.error("Error adding record:", e);
    return res.status(400).json({ error: e.message });
  }
});

// Get All
router.get("/", async (req, res) => {
  try {
    const record = await Record.find().populate("category");
    return res.json({ record });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// GET BY USER ID , pass in current log in user
router.get("/userID/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findOne({ kindeId: userID });

    const records = await Record.find({ user: user._id }).populate("category");

    if (records.length === 0) {
      return res.status(400).json({ message: "No records found" });
    }

    return res.json(records);
  } catch (e) {
    console.error("Error fetching records by user ID:", e);
    return res.status(400).json({ error: e.message });
  }
});

// Edit
router.put("/:id", async (req, res) => {
  try {
    let record = await Record.findOne({ _id: req.params.id });

    if (!record) {
      return res.status(404).json({ msg: "This Record isn't found!" });
    }

    record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json({ msg: "Successfully Edited!", record });
  } catch (e) {
    console.error("Error editing record:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (record) {
      await Record.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Successfully Deleted!" });
    } else {
      return res.status(404).json({ msg: "This Record isn't found!" });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
