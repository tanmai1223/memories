import express from "express";
import User from "../models/user.js";
import { deleteImage } from "../utils/cloudinary.js";
import Memories from "../models/memories.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    const data = [];

    for (const user of users) {
      const totalCount = await Memories.countDocuments({ user: user._id });
      data.push({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        totalMemories: totalCount,
      });
    }

    res.status(200).json({ message: "All users list", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id);
    res.status(200).json({ message: "The User", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    for (const user of users) {
      if (user.cloudinary_id) {
        try {
          await deleteImage(user.cloudinary_id);
        } catch (err) {
          console.error(
            `Failed to delete image for user ${user._id}:`,
            err.message
          );
        }
      }
      //console.log(user._id)

      await User.findByIdAndDelete(user._id);
    }

    res
      .status(200)
      .json({ message: "All users and their images deleted successfully!!" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred", error: err.message });
  }
};
