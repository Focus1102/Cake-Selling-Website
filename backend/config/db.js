require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB at:", process.env.MONGO_URI); // Log URI MongoDB
  } catch (error) {
    console.error("MongoDB connection error:", error.message); // Log lỗi kết nối
    process.exit(1);
  }
}

module.exports = connectDB;
