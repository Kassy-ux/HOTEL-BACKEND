"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdateSchema = exports.passwordUpdateSchema = exports.passwordResetRequestSchema = exports.loginSchema = exports.registerSchema = void 0;
// auth.validator.ts
const zod_1 = require("zod");
const schema_1 = require("../drizzle/schema");
// Exact schema-matching validations
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string()
        .min(1, "First name is required")
        .max(100, "First name cannot exceed 100 characters"),
    lastName: zod_1.z.string()
        .min(1, "Last name is required")
        .max(100, "Last name cannot exceed 100 characters"),
    email: zod_1.z.string()
        .email("Invalid email format")
        .max(255, "Email cannot exceed 255 characters"),
    password: zod_1.z.string()
        .min(1, "Password is required")
        .max(255, "Password cannot exceed 255 characters"),
    contactPhone: zod_1.z.string()
        .max(20, "Contact phone cannot exceed 20 characters")
        .optional(),
    address: zod_1.z.string()
        .max(255, "Address cannot exceed 255 characters")
        .optional(),
    role: zod_1.z.enum(schema_1.roleEnum.enumValues).default('user')
}).strict();
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email("Invalid email format")
        .max(255, "Email cannot exceed 255 characters"),
    password: zod_1.z.string()
        .min(1, "Password is required")
        .max(255, "Password cannot exceed 255 characters")
}).strict();
exports.passwordResetRequestSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email("Invalid email format")
        .max(255, "Email cannot exceed 255 characters")
}).strict();
exports.passwordUpdateSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
    newPassword: zod_1.z.string()
        .min(1, "Password is required")
        .max(255, "Password cannot exceed 255 characters"),
    confirmPassword: zod_1.z.string()
        .min(1, "Please confirm your password")
}).strict()
    .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
exports.profileUpdateSchema = zod_1.z.object({
    firstName: zod_1.z.string()
        .max(100, "First name cannot exceed 100 characters")
        .optional(),
    lastName: zod_1.z.string()
        .max(100, "Last name cannot exceed 100 characters")
        .optional(),
    contactPhone: zod_1.z.string()
        .max(20, "Contact phone cannot exceed 20 characters")
        .optional(),
    address: zod_1.z.string()
        .max(255, "Address cannot exceed 255 characters")
        .optional()
}).strict()
    .refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});
