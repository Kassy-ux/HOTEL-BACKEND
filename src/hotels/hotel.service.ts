import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { hotels } from "../drizzle/schema";
import { HotelInput, HotelUpdateInput, hotelSchema, hotelUpdateSchema } from "../validation/hotel.validator";

// ✅ Get all hotels with their rooms
export const getAllHotelsService = async () => {
  return await db.query.hotels.findMany({
    with: {
      rooms: true,
    },
  });
};

// ✅ Get a hotel by ID with rooms
export const getHotelByIdService = async (hotelId: number) => {
  return await db.query.hotels.findFirst({
    where: eq(hotels.hotelId, hotelId),
    with: {
      rooms: true,
    },
  });
};

// ✅ Create a new hotel and return with rooms (initially empty)
export const createHotelService = async (data: HotelInput) => {
  const validated = hotelSchema.parse(data);
  const result = await db
    .insert(hotels)
    .values({
      ...validated,
      rating: validated.rating?.toString(),
    })
    .returning();

  const createdHotel = result[0];

  // Fetch with rooms
  return await db.query.hotels.findFirst({
    where: eq(hotels.hotelId, createdHotel.hotelId),
    with: {
      rooms: true,
    },
  });
};

// ✅ Update hotel by ID and return with rooms
export const updateHotelService = async (hotelId: number, data: HotelUpdateInput) => {
  const validated = hotelUpdateSchema.parse(data);

  await db
    .update(hotels)
    .set({
      ...validated,
      rating: validated.rating?.toString(),
      updatedAt: new Date(),
    })
    .where(eq(hotels.hotelId, hotelId));

  return await db.query.hotels.findFirst({
    where: eq(hotels.hotelId, hotelId),
    with: {
      rooms: true,
    },
  });
};

// ✅ Delete hotel and return the deleted record with rooms
export const deleteHotelService = async (hotelId: number) => {
  const deletedHotel = await db.query.hotels.findFirst({
    where: eq(hotels.hotelId, hotelId),
    with: {
      rooms: true,
    },
  });

  await db.delete(hotels).where(eq(hotels.hotelId, hotelId));
  return deletedHotel;
};
