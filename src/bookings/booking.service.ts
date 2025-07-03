import { eq, and, gte, lte, between } from "drizzle-orm";
import db from "../drizzle/db";
import { bookings, rooms, users, TBookingsSelect, TBookingsInsert } from "../drizzle/schema";

export const getAllBookingsService = async (): Promise<TBookingsSelect[] | null> => {
  return await db.query.bookings.findMany({
    with: {
      user: {
        columns: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true
        }
      },
      room: {
        with: {
          hotel: {
            columns: {
              name: true,
              location: true,
              address: true
            }
          }
        }
      },
      payments: true
    },
    orderBy: (bookings, { desc }) => [desc(bookings.createdAt)]
  });
};

export const getBookingByIdService = async (id: number): Promise<TBookingsSelect | undefined> => {
  return await db.query.bookings.findFirst({
    where: eq(bookings.bookingId, id),
    with: {
      user: {
        columns: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true,
          address: true
        }
      },
      room: {
        with: {
          hotel: {
            columns: {
              hotelId: true,
              name: true,
              location: true,
              address: true,
              contactPhone: true,
              category: true,
              rating: true
            }
          }
        }
      },
      payments: {
        orderBy: (payments, { desc }) => [desc(payments.createdAt)]
      }
    }
  });
};

export const getBookingsByUserIdService = async (userId: number): Promise<TBookingsSelect[] | null> => {
  return await db.query.bookings.findMany({
    where: eq(bookings.userId, userId),
    with: {
      room: {
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
      },
      payments: true
    },
    orderBy: (bookings, { desc }) => [desc(bookings.createdAt)]
  });
};

export const getBookingsByRoomIdService = async (roomId: number): Promise<TBookingsSelect[] | null> => {
  return await db.query.bookings.findMany({
    where: eq(bookings.roomId, roomId),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true
        }
      },
      payments: true
    },
    orderBy: (bookings, { desc }) => [desc(bookings.checkInDate)]
  });
};

export const getBookingsByStatusService = async (status: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<TBookingsSelect[] | null> => {
  return await db.query.bookings.findMany({
    where: eq(bookings.bookingStatus, status),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true
        }
      },
      room: {
        with: {
          hotel: {
            columns: {
              name: true,
              location: true
            }
          }
        }
        
      },
      payments: true
    },
    orderBy: (bookings, { desc }) => [desc(bookings.createdAt)]
  });
};

export const getBookingsByDateRangeService = async (startDate: string, endDate: string): Promise<TBookingsSelect[] | null> => {
  return await db.query.bookings.findMany({
    where: and(
      gte(bookings.checkInDate, startDate),
      lte(bookings.checkOutDate, endDate)
    ),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true
        }
      },
      room: {
        with: {
          hotel: {
            columns: {
              name: true,
              location: true
            }
          }
        }
      }
    },
    orderBy: (bookings, { asc }) => [asc(bookings.checkInDate)]
  });
};

export const checkRoomAvailabilityService = async (
  roomId: number, 
  checkInDate: string, 
  checkOutDate: string
): Promise<boolean> => {
  const conflictingBookings = await db.query.bookings.findMany({
    where: and(
      eq(bookings.roomId, roomId),
      eq(bookings.bookingStatus, 'Confirmed'),
      // Check for date overlap
      and(
        lte(bookings.checkInDate, checkOutDate),
        gte(bookings.checkOutDate, checkInDate)
      )
    )
  });
  
  return conflictingBookings.length === 0;
};

export const createNewBookingService = async (bookingData: any): Promise<string> => {
  // Check if room is available for the given dates
  const isAvailable = await checkRoomAvailabilityService(
    bookingData.roomId,
    bookingData.checkInDate,
    bookingData.checkOutDate
  );

  if (!isAvailable) {
    throw new Error("Room is not available for the selected dates");
  }

  // Get room details to calculate total amount
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.roomId, bookingData.roomId)
  });

  if (!room) {
    throw new Error("Room not found");
  }

  // Calculate number of nights and total amount
  const checkIn = new Date(bookingData.checkInDate);
  const checkOut = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = (parseFloat(room.pricePerNight || '0') * nights).toString();

  const insertData = {
    ...bookingData,
    totalAmount,
    bookingStatus: 'Pending' as const
  };
  
  await db.insert(bookings).values(insertData);
  return "Booking created successfully 🎉";
};

export const updateBookingService = async (id: number, bookingData: Partial<TBookingsInsert>): Promise<string> => {
  // If updating dates, check availability
  if (bookingData.checkInDate || bookingData.checkOutDate || bookingData.roomId) {
    const existingBooking = await db.query.bookings.findFirst({
      where: eq(bookings.bookingId, id)
    });

    if (!existingBooking) {
      throw new Error("Booking not found");
    }

    const roomId = bookingData.roomId || existingBooking.roomId;
    const checkInDate = bookingData.checkInDate || existingBooking.checkInDate;
    const checkOutDate = bookingData.checkOutDate || existingBooking.checkOutDate;

    // Check availability excluding current booking
    const conflictingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.roomId, roomId!),
        eq(bookings.bookingStatus, 'Confirmed'),
        // Exclude current booking from check
        // Note: You might need to adjust this based on your specific needs
        and(
          lte(bookings.checkInDate, checkOutDate!),
          gte(bookings.checkOutDate, checkInDate!)
        )
      )
    });

    const hasConflict = conflictingBookings.some(booking => booking.bookingId !== id);
    
    if (hasConflict) {
      throw new Error("Room is not available for the selected dates");
    }
  }

  await db.update(bookings).set(bookingData).where(eq(bookings.bookingId, id));
  return "Booking updated successfully 😎";
};

export const updateBookingStatusService = async (id: number, status: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<string> => {
  await db.update(bookings).set({ 
    bookingStatus: status,
    updatedAt: new Date()
  }).where(eq(bookings.bookingId, id));
  
  const statusEmoji = {
    'Pending': '⏳',
    'Confirmed': '✅', 
    'Cancelled': '❌'
  };
  
  return `Booking status updated to ${status} ${statusEmoji[status]}`;
};

export const cancelBookingService = async (id: number): Promise<string> => {
  return await updateBookingStatusService(id, 'Cancelled');
};

export const confirmBookingService = async (id: number): Promise<string> => {
  return await updateBookingStatusService(id, 'Confirmed');
};

export const deleteBookingService = async (id: number): Promise<string> => {
  await db.delete(bookings).where(eq(bookings.bookingId, id));
  return "Booking deleted successfully 🎉";
};

// Advanced service methods

export const getBookingWithCompleteDetailsService = async (id: number) => {
  return await db.query.bookings.findFirst({
    where: eq(bookings.bookingId, id),
    with: {
      user: true,
      room: {
        with: {
          hotel: true
        }
      },
      payments: {
        orderBy: (payments, { desc }) => [desc(payments.createdAt)]
      }
    }
  });
};

export const getUserBookingHistoryService = async (userId: number) => {
  return await db.query.users.findFirst({
    where: eq(users.userId, userId),
    with: {
      bookings: {
        with: {
          room: {
            with: {
              hotel: {
                columns: {
                  name: true,
                  location: true,
                  rating: true
                }
              }
            }
          },
          payments: {
            columns: {
              paymentId: true,
              amount: true,
              paymentStatus: true,
              paymentDate: true,
              paymentMethod: true
            }
          }
        },
        orderBy: (bookings, { desc }) => [desc(bookings.createdAt)]
      }
    }
  });
};

export const getHotelBookingsStatsService = async (hotelId: number) => {
  // This would require joining through rooms to get hotel bookings
  return await db.query.rooms.findMany({
    where: eq(rooms.hotelId, hotelId),
    with: {
      bookings: {
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          payments: {
            columns: {
              amount: true,
              paymentStatus: true
            }
          }
        }
      }
    }
  });
};

export const getUpcomingCheckInsService = async (days: number = 7) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return await db.query.bookings.findMany({
    where: and(
      eq(bookings.bookingStatus, 'Confirmed'),
      between(bookings.checkInDate, today.toISOString().split('T')[0], futureDate.toISOString().split('T')[0])
    ),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true
        }
      },
      room: {
        with: {
          hotel: {
            columns: {
              name: true,
              location: true,
              contactPhone: true
            }
          }
        }
      }
    },
    orderBy: (bookings, { asc }) => [asc(bookings.checkInDate)]
  });
};

export const getUpcomingCheckOutsService = async (days: number = 7) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return await db.query.bookings.findMany({
    where: and(
      eq(bookings.bookingStatus, 'Confirmed'),
      between(bookings.checkOutDate, today.toISOString().split('T')[0], futureDate.toISOString().split('T')[0])
    ),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true
        }
      },
      room: {
        with: {
          hotel: {
            columns: {
              name: true,
              location: true,
              contactPhone: true
            }
          }
        }
      }
    },
    orderBy: (bookings, { asc }) => [asc(bookings.checkOutDate)]
  });
};