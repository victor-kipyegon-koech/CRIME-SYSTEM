 import { Request, Response } from "express";
import { ZodError } from "zod";
import { createUserSchema, updateUserSchema } from "../validation/validation";
import {
  createUserServices,
  deleteUserServices,
  getUserByIdServices,
  getUsersServices,
  updateUserServices,
} from "../users/user.service";

// Helper: remove password before sending response
const sanitizeUser = <T extends { password?: string }>(user: T) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// ========== Get All Users ==========
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await getUsersServices();

    if (!allUsers || allUsers.length === 0) {
      res.status(404).json({
        success: false,
        message: "No users found",
      });
      return;
    }

    const safeUsers = allUsers.map((user) => sanitizeUser(user));

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: safeUsers,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to fetch users",
    });
  }
};

// ========== Get User by ID ==========
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id as string, 10);

  if (isNaN(userId)) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
    return;
  }

  try {
    const user = await getUserByIdServices(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: sanitizeUser(user),
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to fetch user",
    });
  }
};

// ========== Create User ==========
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const createdUser = await createUserServices(validatedData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: typeof createdUser === "object" ? sanitizeUser(createdUser) : createdUser,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to create user",
    });
  }
};

// ========== Update User ==========
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id as string, 10);

  if (isNaN(userId)) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
    return;
  }

  try {
    const validatedData = updateUserSchema.parse(req.body);
    const updatedUser = await updateUserServices(userId, validatedData);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: typeof updatedUser === "object" ? sanitizeUser(updatedUser) : updatedUser,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to update user",
    });
  }
};

// ========== Delete User ==========
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id as string, 10);

  if (isNaN(userId)) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
    return;
  }

  try {
    const deletedUser = await deleteUserServices(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to delete user",
    });
  }
};