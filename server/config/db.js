const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database with auto-retry logic.
 * Utilizes the MONGO_URI environment variable for the connection string.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successful.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Wait up to 30 seconds for a response
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log("Retrying database connection in 5 seconds...");
    
    // Retry instead of killing the app with process.exit(1)
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;