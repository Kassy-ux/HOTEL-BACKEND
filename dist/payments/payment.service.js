"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsOnlyByUserIdService = exports.deleteHotelPaymentService = exports.getHotelPaymentsByUserIdService = exports.getHotelPaymentByIdService = exports.getAllHotelPaymentsService = exports.createHotelPaymentService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
// Create new payment
const createHotelPaymentService = async (payment) => {
    const [newPayment] = await db_1.default.insert(schema_1.payments).values(payment).returning();
    // Optional: Update booking status if payment is completed and bookingId exists
    if (payment.paymentStatus === "Completed" && payment.bookingId !== undefined && payment.bookingId !== null) {
        await db_1.default.update(schema_1.bookings)
            .set({ bookingStatus: "Confirmed" })
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, payment.bookingId));
    }
    return newPayment;
};
exports.createHotelPaymentService = createHotelPaymentService;
// Get all payments with booking, user, and room
const getAllHotelPaymentsService = async (page, pageSize) => {
    const list = await db_1.default.query.payments.findMany({
        with: {
            booking: {
                with: {
                    user: { columns: { password: false } },
                    room: true,
                },
            },
        },
        orderBy: (0, drizzle_orm_1.desc)(schema_1.payments.paymentId),
        offset: (page - 1) * pageSize,
        limit: pageSize,
    });
    return list;
};
exports.getAllHotelPaymentsService = getAllHotelPaymentsService;
// Get a single payment by ID
const getHotelPaymentByIdService = async (paymentId) => {
    return await db_1.default.query.payments.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.payments.paymentId, paymentId),
        with: {
            booking: {
                with: {
                    user: { columns: { password: false } },
                    room: true,
                },
            },
        },
    });
};
exports.getHotelPaymentByIdService = getHotelPaymentByIdService;
// Get all payments for a given user ID
const getHotelPaymentsByUserIdService = async (userId, page, pageSize) => {
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId),
        with: {
            payments: true,
            user: { columns: { password: false } },
            room: true,
        },
        orderBy: (0, drizzle_orm_1.desc)(schema_1.bookings.bookingId),
        offset: (page - 1) * pageSize,
        limit: pageSize,
    });
};
exports.getHotelPaymentsByUserIdService = getHotelPaymentsByUserIdService;
// Delete a payment
const deleteHotelPaymentService = async (paymentId) => {
    await db_1.default.delete(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.paymentId, paymentId));
    return "Payment deleted successfully";
};
exports.deleteHotelPaymentService = deleteHotelPaymentService;
// Get payments directly from payments table for a user
const getPaymentsOnlyByUserIdService = async (userId) => {
    return await db_1.default.query.payments.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.payments.userId, userId), // make sure you store this!
        orderBy: (0, drizzle_orm_1.desc)(schema_1.payments.paymentId),
    });
};
exports.getPaymentsOnlyByUserIdService = getPaymentsOnlyByUserIdService;
