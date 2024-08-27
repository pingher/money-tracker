const mongoose = require("mongoose");
const RecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  amount: { type: Number },
  details: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);
