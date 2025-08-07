import { Router } from "express";
import { deleteAllUsers, getAllUsers, getUserById } from "../controllers/adminControllers.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const routers=Router();

routers.get('/', authenticate,authorizeAdmin, getAllUsers)
routers.get('/:id',authenticate,authorizeAdmin,getUserById)
routers.delete("/", authenticate,authorizeAdmin,deleteAllUsers);

export default routers