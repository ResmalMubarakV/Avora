const mongoose = require("mongoose");

// ==========================================
// MEMORY MODEL SCHEMA
// ==========================================
/**
 * Defines the structure for user travel memories.
 * Includes trip details, cover image, visibility status, and an array of media items.
 */
const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    modeOfTravel: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    coverImagePublicId: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Array of associated gallery assets (images/videos)
    media: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          publicId: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ["image", "video"],
            required: true,
          },
        },
      ],
      default: [],
    },
    // Reference to the authoring user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Performance Indexes for Faster Profile and Memory Queries
memorySchema.index({ user: 1, isPublic: 1 });
memorySchema.index({ user: 1, slug: 1 });
memorySchema.index({ user: 1, startDate: -1 });

module.exports = mongoose.model("Memory", memorySchema);