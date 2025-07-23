import { Router } from "express";
import {
  adminUpdateUserController,
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


userRouter.get("/users",  getUsers);
userRouter.get("/users/:id", getUserById );
userRouter.post("/users", createUser);
userRouter.put("/users/:id", updateUser);
userRouter.patch("/admin/update-user", adminUpdateUserController);
userRouter.delete("/users/:id", deleteUser);
