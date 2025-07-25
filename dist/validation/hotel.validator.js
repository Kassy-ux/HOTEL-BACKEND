"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelUpdateSchema = exports.hotelSchema = void 0;
const zod_1 = require("zod");
exports.hotelSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    location: zod_1.z.string(),
    address: zod_1.z.string().optional(),
    contactPhone: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    rating: zod_1.z.number().optional(),
    hotelImage: zod_1.z.string().url().optional(),
});
exports.hotelUpdateSchema = exports.hotelSchema.partial();
