const mongoose = require("mongoose");

const connectDb = async (url) => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(url);

    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
