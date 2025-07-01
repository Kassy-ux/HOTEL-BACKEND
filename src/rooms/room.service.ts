import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { rooms, hotels, TRoomsSelect, TRoomsInsert } from "../drizzle/schema";

export const getAllRoomsService = async (): Promise<TRoomsSelect[] | null> => {
  return await db.query.rooms.findMany({
    with: {
      hotel: true,
      bookings: true
    }
  });
};

export const getRoomByIdService = async (id: number): Promise<TRoomsSelect | undefined> => {
  return await db.query.rooms.findFirst({
    where: eq(rooms.roomId, id),
    with: {
      hotel: true,
      bookings: {
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }
    }
  });
};

export const getRoomsByHotelIdService = async (hotelId: number): Promise<TRoomsSelect[] | null> => {
  return await db.query.rooms.findMany({
    where: eq(rooms.hotelId, hotelId),
    with: {
      hotel: true,
      bookings: {
        where: (bookings, { eq }) => eq(bookings.bookingStatus, 'Confirmed'),
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });
};

export const getAvailableRoomsService = async (): Promise<TRoomsSelect[] | null> => {
  return await db.query.rooms.findMany({
    where: eq(rooms.isAvailable, true),
    with: {
      hotel: {
        columns: {
          name: true,
          location: true,
          address: true,
          category: true,
          rating: true
        }
      }
    }
  });
};

export const createNewRoomService = async (roomData: any): Promise<string> => {
  // Convert decimal to string for database compatibility
  const insertData = {
    ...roomData,
    pricePerNight: roomData.pricePerNight ? roomData.pricePerNight.toString() : null
  };
  
  await db.insert(rooms).values(insertData);
  return "Room created successfully 🎉";
};

export const updateRoomService = async (id: number, roomData: Partial<TRoomsInsert>): Promise<string> => {
  await db.update(rooms).set(roomData).where(eq(rooms.roomId, id));
  return "Room updated successfully 😎";
};

export const deleteRoomService = async (id: number): Promise<string> => {
  await db.delete(rooms).where(eq(rooms.roomId, id));
  return "Room deleted successfully 🎉";
};

export const updateRoomAvailabilityService = async (id: number, isAvailable: boolean): Promise<string> => {
  await db.update(rooms).set({ isAvailable }).where(eq(rooms.roomId, id));
  return `Room availability updated successfully ${isAvailable ? '✅' : '❌'}`;
};

// Additional service methods leveraging relations

export const getRoomWithBookingHistoryService = async (id: number) => {
  return await db.query.rooms.findFirst({
    where: eq(rooms.roomId, id),
    with: {
      hotel: true,
      bookings: {
        with: {
          user: {
            columns: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          payments: true
        },
        orderBy: (bookings, { desc }) => [desc(bookings.createdAt)]
      }
    }
  });
};

export const getRoomsWithActiveBookingsService = async () => {
  return await db.query.rooms.findMany({
    with: {
      hotel: {
        columns: {
          name: true,
          location: true
        }
      },
      bookings: {
        where: (bookings, { eq }) => eq(bookings.bookingStatus, 'Confirmed'),
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }
    }
  });
};

export const getHotelRoomsWithStatsService = async (hotelId: number) => {
  return await db.query.hotels.findFirst({
    where: eq(hotels.hotelId, hotelId),
    with: {
      rooms: {
        with: {
          bookings: {
            columns: {
              bookingId: true,
              bookingStatus: true,
              totalAmount: true
            }
          }
        }
      }
    }
  });
};