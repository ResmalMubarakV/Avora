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
const createMemory = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const { title, description, location, startDate, endDate, modeOfTravel, isPublic } = req.body;

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

    try {
      coverUpload = await cloudinary.uploader.upload(coverImageFile.path, {
        folder: "avora/covers",
        resource_type: "image",
      });
    } finally {
      await fs.promises.unlink(coverImageFile.path).catch(() => {});
    }

    uploadedPublicIds.push({ publicId: coverUpload.public_id, type: "image" });

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

    const slug = generateSlug(title);
    let finalSlug = slug;
    let counter = 2;

    while (await Memory.findOne({ user: req.user._id, slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

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
// GET MEMORIES (All Memories Space - NO PIN PRIORITY)
// ==========================================
const getMemories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sort || "newest";
    const filterQuery = req.query.filter || "";
    const search = req.query.search || "";
    const yearParam = req.query.year || "";
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (filterQuery) {
      const filters = filterQuery.split(",");
      const conditions = [];
      filters.forEach((f) => {
        if (f === "public") conditions.push({ isPublic: true });
        if (f === "private") conditions.push({ isPublic: false });
        if (f === "liked") conditions.push({ isLiked: true });
      });

      if (conditions.length === 1) {
        Object.assign(query, conditions[0]);
      } else if (conditions.length > 1) {
        query.$and = conditions;
      }
    }

    // Year-based filtering
    if (yearParam && yearParam !== "all") {
      if (yearParam === "older") {
        query.startDate = { $lt: new Date("2020-01-01T00:00:00.000Z") };
      } else {
        const numericYear = parseInt(yearParam);
        if (!isNaN(numericYear)) {
          const startOfYear = new Date(`${numericYear}-01-01T00:00:00.000Z`);
          const endOfYear = new Date(`${numericYear}-12-31T23:59:59.999Z`);
          query.startDate = { $gte: startOfYear, $lte: endOfYear };
        }
      }
    }

    const totalMemories = await Memory.countDocuments(query);
    const totalPages = Math.ceil(totalMemories / limit) || 1;

    let sortOption = {};
    if (sortBy === "oldest") {
      sortOption = { startDate: 1 };
    } else if (sortBy === "title") {
      sortOption = { title: 1 };
    } else {
      sortOption = { startDate: -1 };
    }

    const memories = await Memory.find(query)
      .populate("user", "username")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      memories,
      currentPage: page,
      totalPages,
      totalMemories,
    });
  } catch (error) {
    console.error("Get Memories Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET DASHBOARD MEMORIES (For Stats & Recent / With Pin Priority)
// ==========================================
const getDashboardMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user._id })
      .populate("user", "username")
      .sort({ isPinned: -1, createdAt: -1 });

    return res.status(200).json(memories);
  } catch (error) {
    console.error("Get Dashboard Memories Error", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// GET MEMORY BY ID
// ==========================================
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

    if (oldCoverPublicId) {
      try {
        await cloudinary.uploader.destroy(oldCoverPublicId);
      } catch (err) {
        console.error("Cover Cleanup Error:", err.message);
      }
    }

    const updatedMemory = await Memory.findById(memory._id).populate("user", "username");

    return res.status(200).json(updatedMemory);
  } catch (error) {
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

    try {
      await cloudinary.uploader.destroy(mediaPublicId, {
        resource_type: media.type === "video" ? "video" : "image",
      });
    } catch (error) {
      console.error("Cloudinary delete error", error.message);
      return res.status(500).json({ message: "Failed to delete media from Cloudinary" });
    }

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
  getDashboardMemories, 
  getMemoryById,
  toggleLikeMemory,
  togglePinMemory,
  updateMemory,
  deleteMemory,
  deleteMedia,
  downloadMedia,
};