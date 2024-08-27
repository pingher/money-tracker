const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add new category
router.post("/", upload.single("icons"), async (req, res) => {
  try {
    let category = new Category(req.body);
    if (req.file) {
      category.icons = req.file.filename;
    }
    await category.save();
    return res.json({ category, msg: "Category added successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// Get All
router.get("/", async (req, res) => {
  try {
    let category = await Category.find();
    return res.json(category);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(400).json({ msg: "Category doesn't exist" });

    // DELETE the image of this category inside the public folder
    if (category.icons) {
      const fileName = category.icons;
      const filePath = path.join(__dirname, "../public/" + fileName);
      fs.unlinkSync(filePath);
    }
    await Category.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Category successfully deleted" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
