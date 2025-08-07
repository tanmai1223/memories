import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import Memories from "../models/memories.js";

export const createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Fields can't be empty" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await uploadImage(req.file.path);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profileImage: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await newUser.save();
    //console.log(newUser)
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginProfile = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({ message: "Fields cant be empty" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesnt exits" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ message: "User logged in", user, token });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName,password } = req.body;
    const file = req.file;
    const id=req.params.id
    const getUser = await User.findOne({ _id:id });
    //console.log(getUser)
    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!fullName || !password) {
      return res.status(404).json({ message: "Fields cant be empty" });
    }

    if (file) {
      if (getUser.cloudinary_id) {
        await deleteImage(getUser.cloudinary_id);
      }

      const result = await uploadImage(file.path);
      getUser.profileImage = result.secure_url;
      getUser.cloudinary_id = result.public_id;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      getUser.password = hashedPassword;
    }

    if (fullName) {
      getUser.fullName = fullName;
    }

    await getUser.save();
    res.status(200).json({ message: "Updated", user: getUser });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all memories by this user
    const memories = await Memories.find({ user: id });

    // Delete each memory's image from Cloudinary
    for (const memory of memories) {
      if (memory.cloudinary_id) {
        await deleteImage(memory.cloudinary_id);
      }
    }

    // Delete all memories from DB
    await Memories.deleteMany({ user: id });

    // Delete user's profile image if exists
    if (user.cloudinary_id) {
      await deleteImage(user.cloudinary_id);
    }

    // Finally delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User and their memories deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
