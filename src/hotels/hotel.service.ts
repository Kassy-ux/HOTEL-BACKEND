import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { hotels } from "../drizzle/schema";
import { HotelInput, HotelUpdateInput, hotelSchema, hotelUpdateSchema } from "../validation/hotel.validator";

// Get all hotels
export const getAllHotelsService = async () => {
  return await db.query.hotels.findMany({
    with:{
      rooms:true
  
    }
  } );
};

// Get a hotel by ID
export const getHotelByIdService = async (hotelId: number) => {
  const result = await db.select().from(hotels).where(eq(hotels.hotelId, hotelId));
  return result[0];
};

// Create a new hotel
export const createHotelService = async (data: HotelInput) => {
  const validated = hotelSchema.parse(data);
  const result = await db.insert(hotels).values({ ...validated, rating: validated.rating?.toString() }).returning();
  return result[0];
};

// Update hotel by ID
export const updateHotelService = async (hotelId: number, data: HotelUpdateInput) => {
  const validated = hotelUpdateSchema.parse(data);
  const result = await db
    .update(hotels)
    .set({ ...validated, rating: validated.rating?.toString(), updatedAt: new Date() })
    .where(eq(hotels.hotelId, hotelId))
    .returning();
  return result[0];
};

// Delete hotel by ID
export const deleteHotelService = async (hotelId: number) => {
  const result = await db.delete(hotels).where(eq(hotels.hotelId, hotelId)).returning();
  return result[0];
};
