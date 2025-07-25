"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusToConfirmedService = exports.changeRoomService = exports.getUpcomingCheckOutsService = exports.getUpcomingCheckInsService = exports.getHotelBookingsStatsService = exports.getUserBookingHistoryService = exports.getBookingWithCompleteDetailsService = exports.deleteBookingService = exports.confirmBookingService = exports.cancelBookingService = exports.updateBookingStatusService = exports.updateBookingService = exports.createNewBookingService = exports.checkRoomAvailabilityService = exports.getBookingsByDateRangeService = exports.getBookingsByStatusService = exports.getBookingsByRoomIdService = exports.getBookingsByUserIdService = exports.getBookingByIdService = exports.getAllBookingsService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const getAllBookingsService = async () => {
    return await db_1.default.query.bookings.findMany({
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
exports.getAllBookingsService = getAllBookingsService;
const getBookingByIdService = async (id) => {
    return await db_1.default.query.bookings.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, id),
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
exports.getBookingByIdService = getBookingByIdService;
const getBookingsByUserIdService = async (userId) => {
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId),
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
exports.getBookingsByUserIdService = getBookingsByUserIdService;
const getBookingsByRoomIdService = async (roomId) => {
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.roomId, roomId),
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
exports.getBookingsByRoomIdService = getBookingsByRoomIdService;
const getBookingsByStatusService = async (status) => {
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.bookingStatus, status),
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
exports.getBookingsByStatusService = getBookingsByStatusService;
const getBookingsByDateRangeService = async (startDate, endDate) => {
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.bookings.checkInDate, startDate), (0, drizzle_orm_1.lte)(schema_1.bookings.checkOutDate, endDate)),
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
exports.getBookingsByDateRangeService = getBookingsByDateRangeService;
const checkRoomAvailabilityService = async (roomId, checkInDate, checkOutDate) => {
    const conflictingBookings = await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.roomId, roomId), (0, drizzle_orm_1.eq)(schema_1.bookings.bookingStatus, 'Confirmed'), 
        // Check for date overlap
        (0, drizzle_orm_1.and)((0, drizzle_orm_1.lte)(schema_1.bookings.checkInDate, checkOutDate), (0, drizzle_orm_1.gte)(schema_1.bookings.checkOutDate, checkInDate)))
    });
    return conflictingBookings.length === 0;
};
exports.checkRoomAvailabilityService = checkRoomAvailabilityService;
const createNewBookingService = async (bookingData) => {
    // Check if room is available for the given dates
    const isAvailable = await (0, exports.checkRoomAvailabilityService)(bookingData.roomId, bookingData.checkInDate, bookingData.checkOutDate);
    if (!isAvailable) {
        throw new Error("Room is not available for the selected dates");
    }
    // Get room details to calculate total amount
    const room = await db_1.default.query.rooms.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.rooms.roomId, bookingData.roomId)
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
        bookingStatus: 'Pending'
    };
    await db_1.default.insert(schema_1.bookings).values(insertData);
    return "Booking created successfully 🎉";
};
exports.createNewBookingService = createNewBookingService;
const updateBookingService = async (id, bookingData) => {
    // If updating dates, check availability
    if (bookingData.checkInDate || bookingData.checkOutDate || bookingData.roomId) {
        const existingBooking = await db_1.default.query.bookings.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, id)
        });
        if (!existingBooking) {
            throw new Error("Booking not found");
        }
        const roomId = bookingData.roomId || existingBooking.roomId;
        const checkInDate = bookingData.checkInDate || existingBooking.checkInDate;
        const checkOutDate = bookingData.checkOutDate || existingBooking.checkOutDate;
        // Check availability excluding current booking
        const conflictingBookings = await db_1.default.query.bookings.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.roomId, roomId), (0, drizzle_orm_1.eq)(schema_1.bookings.bookingStatus, 'Confirmed'), 
            // Exclude current booking from check
            // Note: You might need to adjust this based on your specific needs
            (0, drizzle_orm_1.and)((0, drizzle_orm_1.lte)(schema_1.bookings.checkInDate, checkOutDate), (0, drizzle_orm_1.gte)(schema_1.bookings.checkOutDate, checkInDate)))
        });
        const hasConflict = conflictingBookings.some(booking => booking.bookingId !== id);
        if (hasConflict) {
            throw new Error("Room is not available for the selected dates");
        }
    }
    await db_1.default.update(schema_1.bookings).set(bookingData).where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, id));
    return "Booking updated successfully 😎";
};
exports.updateBookingService = updateBookingService;
const updateBookingStatusService = async (id, status) => {
    await db_1.default.update(schema_1.bookings).set({
        bookingStatus: status,
        updatedAt: new Date()
    }).where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, id));
    const statusEmoji = {
        'Pending': '⏳',
        'Confirmed': '✅',
        'Cancelled': '❌'
    };
    return `Booking status updated to ${status} ${statusEmoji[status]}`;
};
exports.updateBookingStatusService = updateBookingStatusService;
const cancelBookingService = async (id) => {
    return await (0, exports.updateBookingStatusService)(id, 'Cancelled');
};
exports.cancelBookingService = cancelBookingService;
const confirmBookingService = async (id) => {
    return await (0, exports.updateBookingStatusService)(id, 'Confirmed');
};
exports.confirmBookingService = confirmBookingService;
const deleteBookingService = async (id) => {
    await db_1.default.delete(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, id));
    return "Booking deleted successfully 🎉";
};
exports.deleteBookingService = deleteBookingService;
// Advanced service methods
const getBookingWithCompleteDetailsService = async (id) => {
    return await db_1.default.query.bookings.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, id),
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
exports.getBookingWithCompleteDetailsService = getBookingWithCompleteDetailsService;
const getUserBookingHistoryService = async (userId) => {
    return await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.userId, userId),
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
exports.getUserBookingHistoryService = getUserBookingHistoryService;
const getHotelBookingsStatsService = async (hotelId) => {
    // This would require joining through rooms to get hotel bookings
    return await db_1.default.query.rooms.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.rooms.hotelId, hotelId),
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
exports.getHotelBookingsStatsService = getHotelBookingsStatsService;
const getUpcomingCheckInsService = async (days = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.bookingStatus, 'Confirmed'), (0, drizzle_orm_1.between)(schema_1.bookings.checkInDate, today.toISOString().split('T')[0], futureDate.toISOString().split('T')[0])),
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
exports.getUpcomingCheckInsService = getUpcomingCheckInsService;
const getUpcomingCheckOutsService = async (days = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.bookingStatus, 'Confirmed'), (0, drizzle_orm_1.between)(schema_1.bookings.checkOutDate, today.toISOString().split('T')[0], futureDate.toISOString().split('T')[0])),
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
exports.getUpcomingCheckOutsService = getUpcomingCheckOutsService;
const changeRoomService = async (bookingId, newRoomId) => {
    const booking = await db_1.default.query.bookings.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, bookingId)
    });
    if (!booking)
        throw new Error("Booking not found");
    // ✅ Ensure dates are not null
    if (!booking.checkInDate || !booking.checkOutDate) {
        throw new Error("Booking has missing check-in or check-out date");
    }
    const newRoom = await db_1.default.query.rooms.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.rooms.roomId, newRoomId)
    });
    if (!newRoom)
        throw new Error("New room not found");
    // ✅ Safe to use dates now
    const isAvailable = await (0, exports.checkRoomAvailabilityService)(newRoomId, booking.checkInDate, booking.checkOutDate);
    if (!isAvailable)
        throw new Error("Selected room is not available for the same date range");
    await db_1.default.update(schema_1.bookings).set({
        roomId: newRoomId,
        updatedAt: new Date()
    }).where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, bookingId));
    return `Room changed successfully to Room #${newRoomId} 🎉`;
};
exports.changeRoomService = changeRoomService;
const updateBookingStatusToConfirmedService = async (bookingId) => {
    const [updatedBooking] = await db_1.default
        .update(schema_1.bookings)
        .set({ bookingStatus: "Confirmed" })
        .where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, bookingId))
        .returning();
    return updatedBooking;
};
exports.updateBookingStatusToConfirmedService = updateBookingStatusToConfirmedService;
