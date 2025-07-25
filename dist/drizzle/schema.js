"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportTicketsRelations = exports.paymentsRelations = exports.bookingsRelations = exports.roomsRelations = exports.hotelsRelations = exports.usersRelations = exports.supportTickets = exports.payments = exports.bookings = exports.rooms = exports.hotels = exports.users = exports.ticketStatusEnum = exports.paymentStatusEnum = exports.bookingStatusEnum = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.roleEnum = (0, pg_core_1.pgEnum)('role', ['user', 'admin']);
exports.bookingStatusEnum = (0, pg_core_1.pgEnum)('booking_status', ['Pending', 'Confirmed', 'Cancelled']);
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)('payment_status', ['Pending', 'Completed', 'Failed']);
exports.ticketStatusEnum = (0, pg_core_1.pgEnum)('ticket_status', ['Open', 'Resolved']);
// Users Table
exports.users = (0, pg_core_1.pgTable)("users", {
    userId: (0, pg_core_1.serial)("user_id").primaryKey(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    contactPhone: (0, pg_core_1.varchar)("contact_phone", { length: 20 }),
    address: (0, pg_core_1.varchar)("address", { length: 255 }),
    role: (0, exports.roleEnum)("role").default("user"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Hotels Table
exports.hotels = (0, pg_core_1.pgTable)("hotels", {
    hotelId: (0, pg_core_1.serial)("hotel_id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    location: (0, pg_core_1.varchar)("location", { length: 255 }).notNull(),
    address: (0, pg_core_1.varchar)("address", { length: 255 }),
    contactPhone: (0, pg_core_1.varchar)("contact_phone", { length: 20 }),
    category: (0, pg_core_1.varchar)("category", { length: 50 }),
    rating: (0, pg_core_1.decimal)("rating", { precision: 2, scale: 1 }),
    hotelImage: (0, pg_core_1.varchar)("hotel_image", { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Rooms Table
exports.rooms = (0, pg_core_1.pgTable)("rooms", {
    roomId: (0, pg_core_1.serial)("room_id").primaryKey(),
    hotelId: (0, pg_core_1.integer)("hotel_id").references(() => exports.hotels.hotelId, { onDelete: "cascade" }).notNull(),
    roomType: (0, pg_core_1.varchar)("room_type", { length: 50 }),
    pricePerNight: (0, pg_core_1.decimal)("price_per_night", { precision: 10, scale: 2 }),
    capacity: (0, pg_core_1.integer)("capacity"),
    amenities: (0, pg_core_1.text)("amenities"),
    roomImage: (0, pg_core_1.varchar)("room_image", { length: 255 }),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Bookings Table
exports.bookings = (0, pg_core_1.pgTable)("bookings", {
    bookingId: (0, pg_core_1.serial)("booking_id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.userId, { onDelete: "cascade" }),
    roomId: (0, pg_core_1.integer)("room_id").references(() => exports.rooms.roomId, { onDelete: "cascade" }),
    checkInDate: (0, pg_core_1.date)("check_in_date"),
    checkOutDate: (0, pg_core_1.date)("check_out_date"),
    totalAmount: (0, pg_core_1.decimal)("total_amount", { precision: 10, scale: 2 }),
    bookingStatus: (0, exports.bookingStatusEnum)("booking_status").default("Pending"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Payments Table
exports.payments = (0, pg_core_1.pgTable)("payments", {
    paymentId: (0, pg_core_1.serial)("payment_id").primaryKey(),
    bookingId: (0, pg_core_1.integer)("booking_id").references(() => exports.bookings.bookingId, { onDelete: "cascade" }),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.userId, { onDelete: "cascade" }),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }),
    paymentStatus: (0, exports.paymentStatusEnum)("payment_status").default("Pending"),
    paymentDate: (0, pg_core_1.date)("payment_date"),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 50 }),
    transactionId: (0, pg_core_1.varchar)("transaction_id", { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Support Tickets Table
exports.supportTickets = (0, pg_core_1.pgTable)("support_tickets", {
    ticketId: (0, pg_core_1.serial)("ticket_id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.userId, { onDelete: "cascade" }),
    subject: (0, pg_core_1.varchar)("subject", { length: 255 }),
    description: (0, pg_core_1.text)("description"),
    status: (0, exports.ticketStatusEnum)("status").default("Open"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    bookings: many(exports.bookings),
    tickets: many(exports.supportTickets),
}));
exports.hotelsRelations = (0, drizzle_orm_1.relations)(exports.hotels, ({ many }) => ({
    rooms: many(exports.rooms),
}));
exports.roomsRelations = (0, drizzle_orm_1.relations)(exports.rooms, ({ one, many }) => ({
    hotel: one(exports.hotels, {
        fields: [exports.rooms.hotelId],
        references: [exports.hotels.hotelId],
    }),
    bookings: many(exports.bookings),
}));
exports.bookingsRelations = (0, drizzle_orm_1.relations)(exports.bookings, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.bookings.userId],
        references: [exports.users.userId],
    }),
    room: one(exports.rooms, {
        fields: [exports.bookings.roomId],
        references: [exports.rooms.roomId],
    }),
    payments: many(exports.payments),
}));
exports.paymentsRelations = (0, drizzle_orm_1.relations)(exports.payments, ({ one }) => ({
    booking: one(exports.bookings, {
        fields: [exports.payments.bookingId],
        references: [exports.bookings.bookingId],
    }),
}));
exports.supportTicketsRelations = (0, drizzle_orm_1.relations)(exports.supportTickets, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.supportTickets.userId],
        references: [exports.users.userId],
    }),
}));
