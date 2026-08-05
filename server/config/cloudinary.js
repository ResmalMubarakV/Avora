const cloudinary = require("cloudinary").v2;

/**
 * Cloudinary Configuration
 * Configures the Cloudinary v2 SDK using environment variables.
 * This configured instance is exported for use across upload controllers and middlewares.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;