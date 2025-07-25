"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRouter = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
exports.BookingRouter = (0, express_1.Router)();
// Basic CRUD operations
exports.BookingRouter.get("/bookings", booking_controller_1.getAllBookings); // GET /api/bookings
exports.BookingRouter.post("/bookings", booking_controller_1.createNewBooking); // POST /api/bookings
exports.BookingRouter.get("/booking/:id", booking_controller_1.getBookingById); // GET /api/bookings/:id
exports.BookingRouter.put("/booking/:id", booking_controller_1.updateBooking); // PUT /api/bookings/:id
exports.BookingRouter.delete("/bookings/:id", booking_controller_1.deleteBooking); // DELETE /api/bookings/:id
// Status management
exports.BookingRouter.patch("/booking/:id/status", booking_controller_1.updateBookingStatus); // PATCH /api/bookings/:id/status
exports.BookingRouter.patch("/bookings/:id/cancel", booking_controller_1.cancelBooking); // PATCH /api/bookings/:id/cancel
exports.BookingRouter.patch("/booking/:id/confirm", booking_controller_1.confirmBooking); // PATCH /api/bookings/:id/confirm
exports.BookingRouter.put("/:bookingId/confirm", booking_controller_1.updateBookingStatusToConfirmedController);
// Query by relationships
exports.BookingRouter.get("/bookings/user/:userId", booking_controller_1.getBookingsByUserId); // GET /api/bookings/user/:userId
exports.BookingRouter.get("/booking/room/:roomId", booking_controller_1.getBookingsByRoomId); // GET /api/bookings/room/:roomId
exports.BookingRouter.get("/booking/:status", booking_controller_1.getBookingsByStatus); // GET /api/bookings/status/:status
// Advanced queries
exports.BookingRouter.get("/booking/search/date-range", booking_controller_1.getBookingsByDateRange); // GET /api/bookings/search/date-range?startDate=2024-01-01&endDate=2024-01-31
exports.BookingRouter.get("/booking/room/:id/availability", booking_controller_1.checkRoomAvailability);
exports.BookingRouter.patch("/bookings/:id/change-room", booking_controller_1.changeRoomController); // GET /api/bookings/room/:roomId/availability?checkInDate=2024-01-01&checkOutDate=2024-01-05
// Detailed views
exports.BookingRouter.get("/booking/:id/details", booking_controller_1.getBookingWithCompleteDetails); // GET /api/bookings/:id/details
exports.BookingRouter.get("/booking/:userId/history", booking_controller_1.getUserBookingHistory); // GET /api/bookings/user/:userId/history
// Hotel management
exports.BookingRouter.get("/booking/hotel/:hotelId/stats", booking_controller_1.getHotelBookingsStats); // GET /api/bookings/hotel/:hotelId/stats
// Dashboard/Reports
exports.BookingRouter.get("/booking/reports/upcoming-checkins", booking_controller_1.getUpcomingCheckIns); // GET /api/bookings/reports/upcoming-checkins?days=7
exports.BookingRouter.get("/booking/reports/upcoming-checkouts", booking_controller_1.getUpcomingCheckOuts); // GET /api/bookings/reports/upcoming-checkouts?days=7
exports.default = exports.BookingRouter;
