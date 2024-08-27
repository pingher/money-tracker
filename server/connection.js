const mongoose = require("mongoose");
require("dotenv").config();
const { DB_URL } = process.env;

const connect = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Connected to MongoDB`);
  } catch (e) {
    console.error(`ERROR CONNECTING TO MONGODB: ${e.message}`);
  }
};

module.exports = connect;
