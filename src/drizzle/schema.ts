
import { pgTable, serial, varchar, integer, boolean, decimal, timestamp, date, pgEnum, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', ['Pending', 'Confirmed', 'Cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['Pending', 'Completed', 'Failed']);
export const ticketStatusEnum = pgEnum('ticket_status', ['Open', 'Resolved']);

// Users Table
export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  profileUrl: varchar("profile_url", { length: 500 }), 
  role: roleEnum("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hotels Table
export const hotels = pgTable("hotels", {
  hotelId: serial("hotel_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  category: varchar("category", { length: 50 }),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  hotelImage: varchar("hotel_image", { length: 255 }), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// Rooms Table
export const rooms = pgTable("rooms", {
  roomId: serial("room_id").primaryKey(),
  hotelId: integer("hotel_id").references(() => hotels.hotelId, { onDelete: "cascade" }).notNull(),
  roomType: varchar("room_type", { length: 50 }),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }),
  capacity: integer("capacity"),
  amenities: text("amenities"),
  roomImage: varchar("room_image", { length: 255 }), 
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings Table
export const bookings = pgTable("bookings", {
  bookingId: serial("booking_id").primaryKey(),
  userId: integer("user_id").references(() => users.userId, { onDelete: "cascade" }),
  roomId: integer("room_id").references(() => rooms.roomId, { onDelete: "cascade" }),
  checkInDate: date("check_in_date"),
  checkOutDate: date("check_out_date"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  bookingStatus: bookingStatusEnum("booking_status").default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments Table
export const payments = pgTable("payments", {
  paymentId: serial("payment_id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.bookingId, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => users.userId, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  paymentStatus: paymentStatusEnum("payment_status").default("Pending"),
  paymentDate: date("payment_date"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
  ticketId: serial("ticket_id").primaryKey(),
  userId: integer("user_id").references(() => users.userId, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }),
  description: text("description"),
  status: ticketStatusEnum("status").default("Open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  tickets: many(supportTickets),
}));

export const hotelsRelations = relations(hotels, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [rooms.hotelId],
    references: [hotels.hotelId],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.userId],
  }),
  room: one(rooms, {
    fields: [bookings.roomId],
    references: [rooms.roomId],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.bookingId],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.userId],
  }),
}));

// Fixed type exports for your schema (replace the incorrect ones at the bottom)

export type TUsersInsert = typeof users.$inferInsert;
export type TUsersSelect = typeof users.$inferSelect;

export type THotelsInsert = typeof hotels.$inferInsert;
export type THotelsSelect = typeof hotels.$inferSelect;

export type TRoomsInsert = typeof rooms.$inferInsert;
export type TRoomsSelect = typeof rooms.$inferSelect;

export type TBookingsInsert = typeof bookings.$inferInsert;
export type TBookingsSelect = typeof bookings.$inferSelect;

export type TPaymentsInsert = typeof payments.$inferInsert;
export type TPaymentsSelect = typeof payments.$inferSelect;

export type TSupportTicketsInsert = typeof supportTickets.$inferInsert;
export type TSupportTicketsSelect = typeof supportTickets.$inferSelect;