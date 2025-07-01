import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller";
import {
  adminOnly,
  userOnly,
  anyAuthenticatedUser,
} from "../middleware/bearAuth"; // Update import to match your actual middleware

export const userRouter = Router();

// User routes definition


userRouter.get("/users", adminOnly, getUsers);
userRouter.get("/users/:id", anyAuthenticatedUser, getUserById );
userRouter.post("/users", createUser);
userRouter.put("/users/:id", anyAuthenticatedUser, updateUser);
userRouter.delete("/users/:id", adminOnly, deleteUser);
