"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAvailabilitySchema = exports.UpdateRoomInputSchema = exports.RoomInputSchema = void 0;
const zod_1 = require("zod");
// Room input validation schema
exports.RoomInputSchema = zod_1.z.object({
    hotelId: zod_1.z.number().int().positive("Hotel ID must be a positive integer"),
    roomType: zod_1.z.string().min(1, "Room type is required").max(50, "Room type must be 50 characters or less").optional(),
    pricePerNight: zod_1.z.number().positive("Price per night must be positive").multipleOf(0.01, "Price must have at most 2 decimal places").optional(),
    capacity: zod_1.z.number().int().positive("Capacity must be a positive integer").optional(),
    amenities: zod_1.z.string().optional(),
    roomImage: zod_1.z.string().url().optional(),
    isAvailable: zod_1.z.boolean().default(true).optional(),
});
// Update room validation schema (all fields optional except hotelId constraint)
exports.UpdateRoomInputSchema = zod_1.z.object({
    hotelId: zod_1.z.number().int().positive("Hotel ID must be a positive integer").optional(),
    roomType: zod_1.z.string().min(1, "Room type cannot be empty").max(50, "Room type must be 50 characters or less").optional(),
    pricePerNight: zod_1.z.number().positive("Price per night must be positive").multipleOf(0.01, "Price must have at most 2 decimal places").optional(),
    capacity: zod_1.z.number().int().positive("Capacity must be a positive integer").optional(),
    amenities: zod_1.z.string().optional(),
    roomImage: zod_1.z.string().url().optional(),
    isAvailable: zod_1.z.boolean().optional(),
});
// Room availability update schema
exports.RoomAvailabilitySchema = zod_1.z.object({
    isAvailable: zod_1.z.boolean(),
});
