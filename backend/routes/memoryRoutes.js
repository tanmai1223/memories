import { Router } from "express";
import {
  createMemory,
  deleteAllMemories,
  deleteMemory,
  displayMemory,
  displayMemoryById,
  displayMemoryByQuery,
  editMemory,
} from "../controllers/memoriesControllers.js";
import upload from "../middlewares/multer.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js"; // ✅ make sure authorizeAdmin is used where needed

const router = Router();

// Create a memory (requires auth + image upload)
router.post("/:id", authenticate, upload.single("image"), createMemory);

// Get all memories (auth required)
router.get("/", authenticate, displayMemory);


router.get("/query", authenticate, displayMemoryByQuery);

router.get("/:id", authenticate, displayMemoryById);


// Get a memory by ID (auth required)

// Edit a memory (auth required)
router.put("/:id", authenticate,upload.single("image"), editMemory);

// Delete a memory by ID (auth required)
router.delete("/:id", authenticate, deleteMemory);

// Delete all memories 
router.delete("/all/:id", authenticate,  deleteAllMemories); 

export default router;
