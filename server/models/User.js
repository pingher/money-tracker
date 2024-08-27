const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  kindeId: { type: String },
  familyName: { type: String },
  givenName: { type: String },
  username: { type: String },
  email: { type: String },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
