import { z } from "zod";

// Room input validation schema
export const RoomInputSchema = z.object({
  hotelId: z.number().int().positive("Hotel ID must be a positive integer"),
  roomType: z.string().min(1, "Room type is required").max(50, "Room type must be 50 characters or less").optional(),
  pricePerNight: z.number().positive("Price per night must be positive").multipleOf(0.01, "Price must have at most 2 decimal places").optional(),
  capacity: z.number().int().positive("Capacity must be a positive integer").optional(),
  amenities: z.string().optional(),
  isAvailable: z.boolean().default(true).optional(),
});

// Update room validation schema (all fields optional except hotelId constraint)
export const UpdateRoomInputSchema = z.object({
  hotelId: z.number().int().positive("Hotel ID must be a positive integer").optional(),
  roomType: z.string().min(1, "Room type cannot be empty").max(50, "Room type must be 50 characters or less").optional(),
  pricePerNight: z.number().positive("Price per night must be positive").multipleOf(0.01, "Price must have at most 2 decimal places").optional(),
  capacity: z.number().int().positive("Capacity must be a positive integer").optional(),
  amenities: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

// Room availability update schema
export const RoomAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

// Type exports
export type RoomInput = z.infer<typeof RoomInputSchema>;
export type UpdateRoomInput = z.infer<typeof UpdateRoomInputSchema>;
export type RoomAvailabilityInput = z.infer<typeof RoomAvailabilitySchema>;