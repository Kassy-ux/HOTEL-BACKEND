"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.updateUserService = exports.createUserService = exports.getUserByIdService = exports.getUsersService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const user_validation_1 = require("../validation/user.validation");
//  Get all users
const getUsersService = async () => {
    return await db_1.default.query.users.findMany({
        with: {
            bookings: true,
        }
    });
};
exports.getUsersService = getUsersService;
//  Get user by ID
const getUserByIdService = async (userId) => {
    return await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.userId, userId),
    });
};
exports.getUserByIdService = getUserByIdService;
// Create new user
const createUserService = async (userData) => {
    const validated = user_validation_1.UserSchema.parse(userData);
    const result = await db_1.default.insert(schema_1.users).values(validated).returning();
    return result[0];
};
exports.createUserService = createUserService;
// Update user
const updateUserService = async (userId, userData) => {
    const validated = user_validation_1.PartialUserSchema.parse(userData);
    const result = await db_1.default
        .update(schema_1.users)
        .set(validated)
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, userId))
        .returning();
    return result[0];
};
exports.updateUserService = updateUserService;
// Delete user
const deleteUserService = async (userId) => {
    const result = await db_1.default
        .delete(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.userId, userId))
        .returning();
    return result[0];
};
exports.deleteUserService = deleteUserService;
