import Memories from "../models/memories.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";

export const createMemory = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Fields can't be empty" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image upload is required" });
    }

    const result = await uploadImage(req.file.path);

    const newMemory = new Memories({
      title,
      description,
      image: result.secure_url,
      cloudinary_id: result.public_id,
      user: req.user.userId, // ✅ use ID from token instead of param
    });

    await newMemory.save();

    res.status(201).json({ message: "Memory created", data: newMemory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const displayMemory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const userId = req.user.userId;
    const skip = (page - 1) * limit;
    const query1 = Memories.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const query2 = Memories.countDocuments({ user: userId });
    const data = await query1;
    const totalCount = await query2;
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      success: true,
      message: "Fetch Successful",
      data,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const displayMemoryByQuery = async (req, res) => {
  try {
    const title = req.query.searchTerm;

    const data = await Memories.find({
      title: { $regex: new RegExp(title, "i") }
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Memory not found" });
    }

    res.status(200).json({ message: "Memory found", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const displayMemoryById = async (req, res) => {
  try {
    const id=req.params.id
    const data = await Memories.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Memory not found" });
    }

    res.status(200).json({ message: "Memory found", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editMemory = async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const file = req.file;
    const memory = await Memories.findById(id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }

    // ✅ Replace Image if New One Uploaded
    if (file) {
      if (memory.cloudinary_id) {
        await deleteImage(memory.cloudinary_id);
      }

      const result = await uploadImage(file.path);
      memory.image = result.secure_url;
      memory.cloudinary_id = result.public_id;
    }

    memory.title = title;
    memory.description = description;

    await memory.save();
    res.status(200).json({ message: "Memory updated", data: memory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const id = req.params.id;
    const memory = await Memories.findById(id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    if (memory.cloudinary_id) {
      await deleteImage(memory.cloudinary_id);
    }

    await Memories.findByIdAndDelete(id);

    res.status(200).json({ message: "Memory deleted", data: memory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAllMemories = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const memories = await Memories.find({user:id});
    console.log(memories);
    for (const memory of memories) {
      if (memory.cloudinary_id) {
        await deleteImage(memory.cloudinary_id);
      }
      await Memories.findByIdAndDelete(memory._id);
    }

    

    res.status(200).json({ message: "All memories deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
