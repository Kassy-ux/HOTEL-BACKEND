// auth.validator.ts
import { z } from "zod";
import { roleEnum } from "../drizzle/schema";

// Exact schema-matching validations
export const registerSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .max(100, "First name cannot exceed 100 characters"),
  lastName: z.string()
    .min(1, "Last name is required")
    .max(100, "Last name cannot exceed 100 characters"),
  email: z.string()
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"),
  password: z.string()
    .min(1, "Password is required")
    .max(255, "Password cannot exceed 255 characters"),
  contactPhone: z.string()
    .max(20, "Contact phone cannot exceed 20 characters")
    .optional(),
  address: z.string()
    .max(255, "Address cannot exceed 255 characters")
    .optional(),
  role: z.enum(roleEnum.enumValues).default('user')
}).strict();

export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters"),
  password: z.string()
    .min(1, "Password is required")
    .max(255, "Password cannot exceed 255 characters")
}).strict();

export const passwordResetRequestSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .max(255, "Email cannot exceed 255 characters")
}).strict();

export const passwordUpdateSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string()
    .min(1, "Password is required")
    .max(255, "Password cannot exceed 255 characters"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password")
}).strict()
.refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const profileUpdateSchema = z.object({
  firstName: z.string()
    .max(100, "First name cannot exceed 100 characters")
    .optional(),
  lastName: z.string()
    .max(100, "Last name cannot exceed 100 characters")
    .optional(),
  contactPhone: z.string()
    .max(20, "Contact phone cannot exceed 20 characters")
    .optional(),
  address: z.string()
    .max(255, "Address cannot exceed 255 characters")
    .optional()
}).strict()
.refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

// Type exports matching your schema
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;