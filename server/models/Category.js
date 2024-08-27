const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  title: { type: String },
  type: { type: String },
  icons: { type: String },
});

module.exports = mongoose.model("Category", CategorySchema);
