const mongoose = require("mongoose");
const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  amount: { type: Number },
  timeline: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Budget", BudgetSchema);
