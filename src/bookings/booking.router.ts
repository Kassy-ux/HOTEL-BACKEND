import { Router } from "express";
import {
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByRoomId,
  getBookingsByStatus,
  getBookingsByDateRange,
  checkRoomAvailability,
  createNewBooking,
  updateBooking,
  updateBookingStatus,
  cancelBooking,
  confirmBooking,
  deleteBooking,
  getBookingWithCompleteDetails,
  getUserBookingHistory,
  getHotelBookingsStats,
  getUpcomingCheckIns,
  getUpcomingCheckOuts
} from "./booking.controller";

export const BookingRouter = Router();

// Basic CRUD operations
BookingRouter.get("/booking", getAllBookings);                                    // GET /api/bookings
BookingRouter.post("/booking", createNewBooking);                                 // POST /api/bookings
BookingRouter.get("/booking/:id", getBookingById);                                 // GET /api/bookings/:id
BookingRouter.put("/booking/:id", updateBooking);                                  // PUT /api/bookings/:id
BookingRouter.delete("/booking/:id", deleteBooking);                               // DELETE /api/bookings/:id

// Status management
BookingRouter.patch("/booking/:id/status", updateBookingStatus);                   // PATCH /api/bookings/:id/status
BookingRouter.patch("/booking/:id/cancel", cancelBooking);                         // PATCH /api/bookings/:id/cancel
BookingRouter.patch("/booking/:id/confirm", confirmBooking);                       // PATCH /api/bookings/:id/confirm

// Query by relationships
BookingRouter.get("/booking/user/:userId", getBookingsByUserId);                   // GET /api/bookings/user/:userId
BookingRouter.get("/booking/room/:roomId", getBookingsByRoomId);                   // GET /api/bookings/room/:roomId
BookingRouter.get("/booking/:status", getBookingsByStatus);                 // GET /api/bookings/status/:status

// Advanced queries
BookingRouter.get("/booking/search/date-range", getBookingsByDateRange);           // GET /api/bookings/search/date-range?startDate=2024-01-01&endDate=2024-01-31
BookingRouter.get("/booking/room/:id/availability", checkRoomAvailability);    // GET /api/bookings/room/:roomId/availability?checkInDate=2024-01-01&checkOutDate=2024-01-05

// Detailed views
BookingRouter.get("/booking/:id/details", getBookingWithCompleteDetails);          // GET /api/bookings/:id/details
BookingRouter.get("/booking/:userId/history", getUserBookingHistory);         // GET /api/bookings/user/:userId/history

// Hotel management
BookingRouter.get("/booking/hotel/:hotelId/stats", getHotelBookingsStats);         // GET /api/bookings/hotel/:hotelId/stats

// Dashboard/Reports
BookingRouter.get("/booking/reports/upcoming-checkins", getUpcomingCheckIns);      // GET /api/bookings/reports/upcoming-checkins?days=7
BookingRouter.get("/booking/reports/upcoming-checkouts", getUpcomingCheckOuts);    // GET /api/bookings/reports/upcoming-checkouts?days=7

export default BookingRouter;