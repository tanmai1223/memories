import { Router } from "express";
import upload from "../middlewares/multer.js";
import {
  createUser,
  deleteProfile,
  loginProfile,
  updateProfile,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const routers = Router();

routers.post("/signup", upload.single("profileImage"), createUser);
routers.post("/login", loginProfile);
routers.put("/profile/:id",authenticate, upload.single("profileImage"), updateProfile);
routers.delete("/profile/:id",authenticate, deleteProfile);

export default routers;
