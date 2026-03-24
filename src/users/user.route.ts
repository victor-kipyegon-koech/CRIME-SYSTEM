 import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller";

// Optional: import role-based auth middleware
// import { adminRoleAuth, officerRoleAuth } from "../middleware/auth";

export const userRouter = Router();

// ================== User Routes ==================

// Get all users (admin only in future)
userRouter.get("/", /* adminRoleAuth, */ getUsers);

// Get user by ID (self or admin)
userRouter.get("/:id", /* adminRoleAuth, */ getUserById);

// Create a new user (registration for citizen or admin)
userRouter.post("/", /* adminRoleAuth, */ createUser);

// Update an existing user (self, admin, or officer)
userRouter.put("/:id", /* adminRoleAuth, */ updateUser);

// Delete an existing user (admin only)
userRouter.delete("/:id", /* adminRoleAuth, */ deleteUser);