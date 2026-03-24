 import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller";

export const userRouter = Router();

// Get all users
userRouter.get("/", getUsers);

// Get user by ID
userRouter.get("/:id", getUserById);

// Create a new user
userRouter.post("/", createUser);

// Update an existing user
userRouter.put("/:id", updateUser);

// Delete an existing user
userRouter.delete("/:id", deleteUser);