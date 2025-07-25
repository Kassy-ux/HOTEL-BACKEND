"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
exports.userRouter = (0, express_1.Router)();
// User routes definition
exports.userRouter.get("/users", user_controller_1.getUsers);
exports.userRouter.get("/users/:id", user_controller_1.getUserById);
exports.userRouter.post("/users", user_controller_1.createUser);
exports.userRouter.put("/users/:id", user_controller_1.updateUser);
exports.userRouter.patch("/admin/update-user", user_controller_1.adminUpdateUserController);
exports.userRouter.delete("/users/:id", user_controller_1.deleteUser);
