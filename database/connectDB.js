const mongoose = require("mongoose");

const db = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Database connection was successful");
  } catch (error) {
    throw error;
  }
};

module.exports = db;
