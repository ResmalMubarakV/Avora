const mongoose = require("mongoose");

/**
 * Establishes a connection to the MongoDB database.
 * Utilizes the MONGO_URI environment variable for the connection string.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successful, or exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    
    // Exit process with failure code (1) to prevent the app from running without a database connection
    process.exit(1);
  }
};

module.exports = connectDB;