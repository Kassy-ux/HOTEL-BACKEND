import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().min(1),
  location: z.string(),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
  category: z.string().optional(),
  rating: z.number().optional(),
  hotelImage: z.string().url().optional(), 
});


export const hotelUpdateSchema = hotelSchema.partial();

export type HotelInput = z.infer<typeof hotelSchema>;
export type HotelUpdateInput = z.infer<typeof hotelUpdateSchema>;
