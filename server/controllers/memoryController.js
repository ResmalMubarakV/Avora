const mongoose = require("mongoose");
const Memory = require("../models/Memory");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Generates a URL-friendly slug from a title string.
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// ==========================================
// CREATE MEMORY
// ==========================================
/**
 * Creates a new memory, handles media uploads, and provides Cloudinary rollback on failure.
 */
const createMemory = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { title, description, location, startDate, endDate, modeOfTravel, isPublic } = req.body;

    // Validate required fields
    if (!title || !description || !location || !startDate || !endDate || !modeOfTravel) {
      return res.status(400).json({ message: "Please fill all the required fields" });
    }

    if (!req.files || !req.files.coverImage || req.files.coverImage.length === 0) {
      return res.status(400).json({ message: "Cover Image Is Required" });
    }

    if (req.body.startDate && req.body.endDate && new Date(req.body.endDate) < new Date(req.body.startDate)) {
      return res.status(400).json({ message: "End date cannot be earlier than the start date." });
    }

    const coverImageFile = req.files.coverImage[0];
    const mediaFiles = req.files.media || [];
    const uploadedMedia = [];
    let coverUpload;

    // Upload cover image
    try {
      coverUpload = await cloudinary.uploader.upload(coverImageFile.path, {
        folder: "avora/covers",
        resource_type: "image",
      });
    } finally {
      await fs.promises.unlink(coverImageFile.path).catch(() => {});
    }

    uploadedPublicIds.push({ publicId: coverUpload.public_id, type: "image" });

    // Upload gallery media items sequentially
    for (const file of mediaFiles) {
      let upload;
      try {
        upload = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "avora/media",
        });
      } finally {
        await fs.promises.unlink(file.path).catch(() => {});
      }

      const type = file.mimetype.startsWith("image/") ? "image" : "video";
      
      // Automatically generate a Cloudinary JPEG poster snapshot for videos
      let posterUrl = "";
      if (type === "video" && upload.secure_url) {
        posterUrl = upload.secure_url
          .replace("/video/upload/", "/video/upload/so_0,f_jpg/")
          .replace(/\.[^/.]+$/, ".jpg");
      }

      uploadedPublicIds.push({ publicId: upload.public_id, type });
      uploadedMedia.push({ 
        url: upload.secure_url, 
        posterUrl: posterUrl, 
        publicId: upload.public_id, 
        type 
      });
    }

    // Generate unique slug
    const slug = generateSlug(title);
    let finalSlug = slug;
    let counter = 2;

    while (await Memory.findOne({ user: req.user._id, slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Save memory to database
    const memory = await Memory.create({
      title,
      description,
      location,
      startDate,
      endDate,
      modeOfTravel,
      coverImage: coverUpload.secure_url,
      coverImagePublicId: coverUpload.public_id,
      isPublic: isPublic === "true",
      media: uploadedMedia,
      slug: finalSlug,
      user: req.user._id,
    });

    return res.status(201).json(memory);
  } catch (error) {
    // Rollback Cloudinary uploads if DB creation fails
    for (const file of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(file.publicId, { resource_type: file.type });
      } catch (cleanupError) {
        console.error("Cloudinary Rollback Error:", cleanupError.message);
      }
    }
    console.error("Create Memory Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET MEMORIES
// ==========================================
/**
 * Retrieves user memories with optional search filtering and pin prioritization.
 */
const getMemories = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { user: req.user._id };

    // Apply search filter across multiple fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Sort by pinned status first (only if no search query is active), then newest first
    const sortOption = search ? { createdAt: -1 } : { isPinned: -1, createdAt: -1 };

    const memories = await Memory.find(query)
      .populate("user", "username")
      .sort(sortOption);

    return res.status(200).json(memories);
  } catch (error) {
    console.error("Get Memories Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET MEMORY BY ID
// ==========================================
/**
 * Retrieves a specific memory by its ID.
 */
const getMemoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Memory ID" });
    }

    const memory = await Memory.findOne({ _id: id, user: req.user._id });
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    return res.status(200).json(memory);
  } catch (error) {
    console.error("Get Memory By Id Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// TOGGLE LIKE MEMORY
// ==========================================
/**
 * Toggles the like/favorite status of a memory.
 */
const toggleLikeMemory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Memory ID" });
    }

    const memory = await Memory.findOne({ _id: id, user: req.user._id });
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    memory.isLiked = !memory.isLiked;
    await memory.save();

    return res.status(200).json({ success: true, isLiked: memory.isLiked });
  } catch (error) {
    console.error("Toggle Like Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// TOGGLE PIN MEMORY
// ==========================================
/**
 * Toggles the pin status of a memory, enforcing a maximum limit of 4 pinned memories.
 */
const togglePinMemory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Memory ID" });
    }

    const memory = await Memory.findOne({ _id: id, user: req.user._id });
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    if (!memory.isPinned) {
      const pinnedCount = await Memory.countDocuments({ user: req.user._id, isPinned: true });
      if (pinnedCount >= 4) {
        return res.status(400).json({ message: "You can only pin up to 4 memories. Please unpin one first." });
      }
    }

    memory.isPinned = !memory.isPinned;
    await memory.save();

    return res.status(200).json({ success: true, isPinned: memory.isPinned });
  } catch (error) {
    console.error("Toggle Pin Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// UPDATE MEMORY
// ==========================================
/**
 * Updates memory details, handles new media uploads, and cleans up removed media.
 */
const updateMemory = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Memory ID" });
    }

    const memory = await Memory.findOne({ _id: id, user: req.user._id });
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    if (Object.keys(req.body).length === 0 && !req.files?.coverImage && !req.files?.media) {
      return res.status(400).json({ message: "Please provide data to update" });
    }

    if (req.body.startDate && req.body.endDate && new Date(req.body.endDate) < new Date(req.body.startDate)) {
      return res.status(400).json({ message: "End date cannot be earlier than the start date." });
    }

    let oldCoverPublicId = null;

    // Update Cover Image if provided
    if (req.files?.coverImage?.length > 0) {
      const coverImageFile = req.files.coverImage[0];
      let coverUpload;

      try {
        coverUpload = await cloudinary.uploader.upload(coverImageFile.path, {
          folder: "avora/covers",
          resource_type: "image",
        });
      } finally {
        await fs.promises.unlink(coverImageFile.path).catch(() => {});
      }

      uploadedPublicIds.push({ publicId: coverUpload.public_id, type: "image" });
      oldCoverPublicId = memory.coverImagePublicId;
      memory.coverImage = coverUpload.secure_url;
      memory.coverImagePublicId = coverUpload.public_id;
    }

    // Append new gallery media
    const uploadedMedia = [];
    if (req.files?.media?.length > 0) {
      for (const file of req.files.media) {
        let upload;
        try {
          upload = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "avora/media",
          });
        } finally {
          await fs.promises.unlink(file.path).catch(() => {});
        }

        const type = file.mimetype.startsWith("image/") ? "image" : "video";
        
        let posterUrl = "";
        if (type === "video" && upload.secure_url) {
          posterUrl = upload.secure_url
            .replace("/video/upload/", "/video/upload/so_0,f_jpg/")
            .replace(/\.[^/.]+$/, ".jpg");
        }

        uploadedPublicIds.push({ publicId: upload.public_id, type });
        uploadedMedia.push({ 
          url: upload.secure_url, 
          posterUrl: posterUrl, 
          publicId: upload.public_id, 
          type 
        });
      }
    }

    // Keep only gallery items selected by frontend
    if (req.body.existingGallery) {
      let keepMedia = [];
      try {
        keepMedia = typeof req.body.existingGallery === "string" 
          ? JSON.parse(req.body.existingGallery) 
          : req.body.existingGallery;
      } catch {
        keepMedia = [];
      }

      const removedMedia = memory.media.filter((item) => !keepMedia.includes(item.publicId));

      // Destroy removed media from Cloudinary
      for (const media of removedMedia) {
        try {
          await cloudinary.uploader.destroy(media.publicId, {
            resource_type: media.type === "video" ? "video" : "image",
          });
        } catch (err) {
          console.error(err.message);
        }
      }

      memory.media = memory.media.filter((item) => keepMedia.includes(item.publicId));
    }

    memory.media.push(...uploadedMedia);

    // Update Slug if Title Changes
    if (req.body.title && req.body.title !== memory.title) {
      const baseSlug = generateSlug(req.body.title);
      let finalSlug = baseSlug;
      let counter = 2;

      while (await Memory.findOne({ user: req.user._id, slug: finalSlug, _id: { $ne: id } })) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      memory.slug = finalSlug;
    }

    // Handle cover removal request
    if (req.body.removeCover === "true" && !req.files?.coverImage?.length) {
      if (memory.coverImagePublicId) {
        try {
          await cloudinary.uploader.destroy(memory.coverImagePublicId);
        } catch (err) {
          console.error("Cover Delete Error:", err.message);
        }
      }
      memory.coverImage = "";
      memory.coverImagePublicId = "";
    }

    // Update standard fields
    memory.title = req.body.title || memory.title;
    memory.description = req.body.description || memory.description;
    memory.location = req.body.location || memory.location;
    memory.startDate = req.body.startDate || memory.startDate;
    memory.endDate = req.body.endDate || memory.endDate;
    memory.modeOfTravel = req.body.modeOfTravel || memory.modeOfTravel;
    
    if (req.body.isPublic !== undefined) {
      memory.isPublic = req.body.isPublic === "true";
    }

    await memory.save();

    // Clean up old cover image after successful save
    if (oldCoverPublicId) {
      try {
        await cloudinary.uploader.destroy(oldCoverPublicId);
      } catch (err) {
        console.error("Cover Cleanup Error:", err.message);
      }
    }

    // Populate user username to ensure frontend routing/slug handles correctly
    const updatedMemory = await Memory.findById(memory._id).populate("user", "username");

    return res.status(200).json(updatedMemory);
  } catch (error) {
    // Rollback new uploads if update fails
    for (const file of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(file.publicId, { resource_type: file.type });
      } catch (cleanupError) {
        console.error("Cloudinary Rollback Error:", cleanupError.message);
      }
    }
    console.error("Update Memory Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// DELETE MEMORY
// ==========================================
/**
 * Deletes a memory and removes all associated assets from Cloudinary.
 */
const deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Memory ID" });
    }

    const memory = await Memory.findOne({ _id: id, user: req.user._id });
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    // Cleanup Cloudinary assets
    try {
      await cloudinary.uploader.destroy(memory.coverImagePublicId);
    } catch (err) {
      console.error("Cover Cleanup Error:", err.message);
    }

    for (const item of memory.media || []) {
      try {
        await cloudinary.uploader.destroy(item.publicId, {
          resource_type: item.type === "video" ? "video" : "image",
        });
      } catch (err) {
        console.error(`Media Cleanup Error (${item.publicId}):`, err.message);
      }
    }

    await memory.deleteOne();
    return res.status(200).json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error("Delete Memory Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// DELETE MEDIA
// ==========================================
/**
 * Removes a specific media item from a memory and deletes it from Cloudinary.
 */
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaPublicId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Memory Id" });
    }

    if (!mediaPublicId) {
      return res.status(400).json({ message: "Media PublicId is Required" });
    }

    const memory = await Memory.findOne({ _id: id, user: req.user._id });
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const media = memory.media.find((item) => item.publicId === mediaPublicId);
    if (!media) {
      return res.status(404).json({ message: "Media Not Found" });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(mediaPublicId, {
        resource_type: media.type === "video" ? "video" : "image",
      });
    } catch (error) {
      console.error("Cloudinary delete error", error.message);
      return res.status(500).json({ message: "Failed to delete media from Cloudinary" });
    }

    // Update DB
    memory.media = memory.media.filter((item) => item.publicId !== mediaPublicId);
    await memory.save();

    return res.status(200).json({ message: "Media deleted successfully", memory });
  } catch (error) {
    console.error("Delete media error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// DOWNLOAD MEDIA
// ==========================================
/**
 * Handles validation for media download requests.
 */
const downloadMedia = async (req, res) => {
  try {
    const { memoryId, mediaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memoryId)) {
      return res.status(400).json({ message: "Invalid Memory ID" });
    }

    const memory = await Memory.findOne({ _id: memoryId, user: req.user._id });
    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    const media = memory.media.id(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }
  } catch (error) {
    console.error("Download Media Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createMemory,
  getMemories,
  getMemoryById,
  toggleLikeMemory,
  togglePinMemory,
  updateMemory,
  deleteMemory,
  deleteMedia,
  downloadMedia,
};