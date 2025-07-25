"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialUserSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    contactPhone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    role: zod_1.z.enum(["admin", "user"]).optional(),
});
exports.PartialUserSchema = exports.UserSchema.partial();
