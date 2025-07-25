"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateUserController = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const user_service_1 = require("./user.service");
const getUsers = async (req, res) => {
    try {
        const allUsers = await (0, user_service_1.getUsersService)();
        if (allUsers == null || allUsers.length == 0) {
            res.status(404).json({ message: "No users found" });
        }
        else {
            // Remove password from each user object before sending response
            const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
            res.status(200).json(usersWithoutPasswords);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }
        // Check if the requesting user is either:
        // 1. An admin, or
        // 2. Requesting their own data
        if (req.user?.role !== "admin" && req.user?.userId !== userId) {
            res.status(403).json({ message: "Forbidden: You can only access your own data" });
            return;
        }
        const user = await (0, user_service_1.getUserByIdService)(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        else {
            // Remove password from each user object before sending response
            const { password, ...userWithoutPassword } = user;
            res.status(200).json(userWithoutPassword);
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await (0, user_service_1.createUserService)(userData);
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Error && error.message.includes("validation")) {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }
        // Check if the requesting user is either:
        // 1. An admin, or
        // 2. Updating their own account
        if (req.user?.role !== "admin" && req.user?.userId !== userId) {
            res.status(403).json({ message: "Forbidden: You can only update your own account" });
            return;
        }
        const updateData = req.body;
        const updatedUser = await (0, user_service_1.updateUserService)(userId, updateData);
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
        if (error instanceof Error && error.message.includes("validation")) {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }
        // Only admin can delete users, but we might want to prevent self-deletion
        if (req.user?.userId === userId) {
            res.status(403).json({ message: "Forbidden: Cannot delete your own account" });
            return;
        }
        const deletedUser = await (0, user_service_1.deleteUserService)(userId);
        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUser = deleteUser;
const adminUpdateUserController = async (req, res) => {
    try {
        const { userId, ...userData } = req.body;
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        const updatedUser = await (0, user_service_1.updateUserService)(userId, userData);
        res.status(200).json(updatedUser);
        return;
    }
    catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Failed to update user" });
        return;
    }
};
exports.adminUpdateUserController = adminUpdateUserController;
