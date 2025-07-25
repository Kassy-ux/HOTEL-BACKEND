"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotelService = exports.updateHotelService = exports.createHotelService = exports.getHotelByIdService = exports.getAllHotelsService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const hotel_validator_1 = require("../validation/hotel.validator");
// ✅ Get all hotels with their rooms
const getAllHotelsService = async () => {
    return await db_1.default.query.hotels.findMany({
        with: {
            rooms: true,
        },
    });
};
exports.getAllHotelsService = getAllHotelsService;
// ✅ Get a hotel by ID with rooms
const getHotelByIdService = async (hotelId) => {
    return await db_1.default.query.hotels.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.hotels.hotelId, hotelId),
        with: {
            rooms: true,
        },
    });
};
exports.getHotelByIdService = getHotelByIdService;
// ✅ Create a new hotel and return with rooms (initially empty)
const createHotelService = async (data) => {
    const validated = hotel_validator_1.hotelSchema.parse(data);
    const result = await db_1.default
        .insert(schema_1.hotels)
        .values({
        ...validated,
        rating: validated.rating?.toString(),
    })
        .returning();
    const createdHotel = result[0];
    // Fetch with rooms
    return await db_1.default.query.hotels.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.hotels.hotelId, createdHotel.hotelId),
        with: {
            rooms: true,
        },
    });
};
exports.createHotelService = createHotelService;
// ✅ Update hotel by ID and return with rooms
const updateHotelService = async (hotelId, data) => {
    const validated = hotel_validator_1.hotelUpdateSchema.parse(data);
    await db_1.default
        .update(schema_1.hotels)
        .set({
        ...validated,
        rating: validated.rating?.toString(),
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.hotels.hotelId, hotelId));
    return await db_1.default.query.hotels.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.hotels.hotelId, hotelId),
        with: {
            rooms: true,
        },
    });
};
exports.updateHotelService = updateHotelService;
// ✅ Delete hotel and return the deleted record with rooms
const deleteHotelService = async (hotelId) => {
    const deletedHotel = await db_1.default.query.hotels.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.hotels.hotelId, hotelId),
        with: {
            rooms: true,
        },
    });
    await db_1.default.delete(schema_1.hotels).where((0, drizzle_orm_1.eq)(schema_1.hotels.hotelId, hotelId));
    return deletedHotel;
};
exports.deleteHotelService = deleteHotelService;
