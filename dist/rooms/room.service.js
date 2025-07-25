"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotelRoomsWithStatsService = exports.getRoomsWithActiveBookingsService = exports.getRoomWithBookingHistoryService = exports.updateRoomAvailabilityService = exports.deleteRoomService = exports.updateRoomService = exports.createNewRoomService = exports.getAvailableRoomsService = exports.getRoomsByHotelIdService = exports.getRoomByIdService = exports.getAllRoomsService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const getAllRoomsService = async () => {
    return await db_1.default.query.rooms.findMany({
        with: {
            hotel: true,
            bookings: true
        }
    });
};
exports.getAllRoomsService = getAllRoomsService;
const getRoomByIdService = async (id) => {
    return await db_1.default.query.rooms.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.rooms.roomId, id),
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
exports.getRoomByIdService = getRoomByIdService;
const getRoomsByHotelIdService = async (hotelId) => {
    return await db_1.default.query.rooms.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.rooms.hotelId, hotelId),
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
exports.getRoomsByHotelIdService = getRoomsByHotelIdService;
const getAvailableRoomsService = async () => {
    return await db_1.default.query.rooms.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.rooms.isAvailable, true),
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
exports.getAvailableRoomsService = getAvailableRoomsService;
const createNewRoomService = async (roomData) => {
    // Convert decimal to string for database compatibility
    const insertData = {
        ...roomData,
        pricePerNight: roomData.pricePerNight ? roomData.pricePerNight.toString() : null
    };
    await db_1.default.insert(schema_1.rooms).values(insertData);
    return "Room created successfully 🎉";
};
exports.createNewRoomService = createNewRoomService;
const updateRoomService = async (id, roomData) => {
    await db_1.default.update(schema_1.rooms).set(roomData).where((0, drizzle_orm_1.eq)(schema_1.rooms.roomId, id));
    return "Room updated successfully 😎";
};
exports.updateRoomService = updateRoomService;
const deleteRoomService = async (id) => {
    await db_1.default.delete(schema_1.rooms).where((0, drizzle_orm_1.eq)(schema_1.rooms.roomId, id));
    return "Room deleted successfully 🎉";
};
exports.deleteRoomService = deleteRoomService;
const updateRoomAvailabilityService = async (id, isAvailable) => {
    await db_1.default.update(schema_1.rooms).set({ isAvailable }).where((0, drizzle_orm_1.eq)(schema_1.rooms.roomId, id));
    return `Room availability updated successfully ${isAvailable ? '✅' : '❌'}`;
};
exports.updateRoomAvailabilityService = updateRoomAvailabilityService;
// Additional service methods leveraging relations
const getRoomWithBookingHistoryService = async (id) => {
    return await db_1.default.query.rooms.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.rooms.roomId, id),
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
exports.getRoomWithBookingHistoryService = getRoomWithBookingHistoryService;
const getRoomsWithActiveBookingsService = async () => {
    return await db_1.default.query.rooms.findMany({
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
exports.getRoomsWithActiveBookingsService = getRoomsWithActiveBookingsService;
const getHotelRoomsWithStatsService = async (hotelId) => {
    return await db_1.default.query.hotels.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.hotels.hotelId, hotelId),
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
exports.getHotelRoomsWithStatsService = getHotelRoomsWithStatsService;
