"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusToConfirmedController = exports.changeRoomController = exports.getUpcomingCheckOuts = exports.getUpcomingCheckIns = exports.getHotelBookingsStats = exports.getUserBookingHistory = exports.getBookingWithCompleteDetails = exports.deleteBooking = exports.confirmBooking = exports.cancelBooking = exports.updateBookingStatus = exports.updateBooking = exports.createNewBooking = exports.checkRoomAvailability = exports.getBookingsByDateRange = exports.getBookingsByStatus = exports.getBookingsByRoomId = exports.getBookingsByUserId = exports.getBookingById = exports.getAllBookings = void 0;
const booking_service_1 = require("./booking.service");
// Get all bookings
const getAllBookings = async (_req, res) => {
    try {
        const bookings = await (0, booking_service_1.getAllBookingsService)();
        if (!bookings?.length) {
            res.status(404).json({ message: "No bookings available" });
            return;
        }
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch bookings" });
    }
};
exports.getAllBookings = getAllBookings;
// Get booking by ID
const getBookingById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
    }
    try {
        const booking = await (0, booking_service_1.getBookingByIdService)(id);
        if (!booking) {
            res.status(404).json({ message: "Booking not found with the provided ID" });
            return;
        }
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch booking details" });
    }
};
exports.getBookingById = getBookingById;
// Get bookings by user ID
const getBookingsByUserId = async (req, res) => {
    const userId = Number(req.params.userId);
    console.log(userId);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID format" });
        return;
    }
    try {
        const bookings = await (0, booking_service_1.getBookingsByUserIdService)(userId);
        if (!bookings?.length) {
            res.status(404).json({ message: "No bookings found for this user" });
            return;
        }
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch user bookings" });
    }
};
exports.getBookingsByUserId = getBookingsByUserId;
// Get bookings by room ID
const getBookingsByRoomId = async (req, res) => {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) {
        res.status(400).json({ error: "Invalid room ID format" });
        return;
    }
    try {
        const bookings = await (0, booking_service_1.getBookingsByRoomIdService)(roomId);
        if (!bookings?.length) {
            res.status(404).json({ message: "No bookings found for this room" });
            return;
        }
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch room bookings" });
    }
};
exports.getBookingsByRoomId = getBookingsByRoomId;
// Get bookings by status
const getBookingsByStatus = async (req, res) => {
    const status = req.params.status;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
        res.status(400).json({ error: "Invalid booking status. Must be: Pending, Confirmed, or Cancelled" });
        return;
    }
    try {
        const bookings = await (0, booking_service_1.getBookingsByStatusService)(status);
        if (!bookings?.length) {
            res.status(404).json({ message: `No ${status.toLowerCase()} bookings available` });
            return;
        }
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch bookings by status" });
    }
};
exports.getBookingsByStatus = getBookingsByStatus;
// Get bookings by date range
const getBookingsByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        res.status(400).json({ error: "Both startDate and endDate query parameters are required" });
        return;
    }
    if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        res.status(400).json({ error: "Invalid date format. Please use ISO format (YYYY-MM-DD)" });
        return;
    }
    try {
        const bookings = await (0, booking_service_1.getBookingsByDateRangeService)(startDate, endDate);
        if (!bookings?.length) {
            res.status(404).json({ message: "No bookings found within the specified date range" });
            return;
        }
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch bookings for date range" });
    }
};
exports.getBookingsByDateRange = getBookingsByDateRange;
// Check room availability
const checkRoomAvailability = async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    const { checkInDate, checkOutDate } = req.query;
    if (isNaN(roomId) || !checkInDate || !checkOutDate) {
        res.status(400).json({ error: "Room ID, checkInDate and checkOutDate are all required" });
        return;
    }
    if (isNaN(Date.parse(checkInDate)) || isNaN(Date.parse(checkOutDate))) {
        res.status(400).json({ error: "Invalid date format. Please use ISO format (YYYY-MM-DD)" });
        return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        res.status(400).json({ error: "Check-out date must be after check-in date" });
        return;
    }
    try {
        const isAvailable = await (0, booking_service_1.checkRoomAvailabilityService)(roomId, checkInDate, checkOutDate);
        res.status(200).json({
            roomId,
            checkInDate,
            checkOutDate,
            isAvailable,
            message: isAvailable ? "Room is available for booking" : "Room is not available for the selected dates"
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to check room availability" });
    }
};
exports.checkRoomAvailability = checkRoomAvailability;
// Create new booking
const createNewBooking = async (req, res) => {
    const bookingData = req.body;
    const requiredFields = ['userId', 'roomId', 'checkInDate', 'checkOutDate'];
    const missing = requiredFields.filter(f => !bookingData[f]);
    if (missing.length > 0) {
        res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
        return;
    }
    if (new Date(bookingData.checkInDate) >= new Date(bookingData.checkOutDate)) {
        res.status(400).json({ error: "Check-out date must be after check-in date" });
        return;
    }
    if (new Date(bookingData.checkInDate) < new Date()) {
        res.status(400).json({ error: "Check-in date cannot be in the past" });
        return;
    }
    try {
        const message = await (0, booking_service_1.createNewBookingService)(bookingData);
        res.status(201).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create booking" });
    }
};
exports.createNewBooking = createNewBooking;
// Update booking
const updateBooking = async (req, res) => {
    const id = parseInt(req.params.id);
    const bookingData = req.body;
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
    }
    if (bookingData.checkInDate && isNaN(Date.parse(bookingData.checkInDate))) {
        res.status(400).json({ error: "Invalid check-in date format. Please use ISO format (YYYY-MM-DD)" });
        return;
    }
    if (bookingData.checkOutDate && isNaN(Date.parse(bookingData.checkOutDate))) {
        res.status(400).json({ error: "Invalid check-out date format. Please use ISO format (YYYY-MM-DD)" });
        return;
    }
    if (bookingData.checkInDate &&
        bookingData.checkOutDate &&
        new Date(bookingData.checkInDate) >= new Date(bookingData.checkOutDate)) {
        res.status(400).json({ error: "Check-out date must be after check-in date" });
        return;
    }
    try {
        const message = await (0, booking_service_1.updateBookingService)(id, bookingData);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update booking" });
    }
};
exports.updateBooking = updateBooking;
// Update booking status
const updateBookingStatus = async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
    }
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
        res.status(400).json({ error: "Invalid status. Must be one of: Pending, Confirmed, or Cancelled" });
        return;
    }
    try {
        const message = await (0, booking_service_1.updateBookingStatusService)(id, status);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update booking status" });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// Cancel booking
const cancelBooking = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
    }
    try {
        const message = await (0, booking_service_1.cancelBookingService)(id);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to cancel booking" });
    }
};
exports.cancelBooking = cancelBooking;
// Confirm booking
const confirmBooking = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
    }
    try {
        const message = await (0, booking_service_1.confirmBookingService)(id);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to confirm booking" });
    }
};
exports.confirmBooking = confirmBooking;
// Delete booking
const deleteBooking = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
    }
    try {
        const message = await (0, booking_service_1.deleteBookingService)(id);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete booking" });
    }
};
exports.deleteBooking = deleteBooking;
// Get booking with complete details
const getBookingWithCompleteDetails = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid booking ID format" });
        return;
    }
    try {
        const booking = await (0, booking_service_1.getBookingWithCompleteDetailsService)(id);
        if (!booking) {
            res.status(404).json({ message: "Booking details not found" });
            return;
        }
        res.status(200).json(booking);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch complete booking details" });
    }
};
exports.getBookingWithCompleteDetails = getBookingWithCompleteDetails;
// Get user booking history
const getUserBookingHistory = async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID format" });
        return;
    }
    try {
        const data = await (0, booking_service_1.getUserBookingHistoryService)(userId);
        if (!data) {
            res.status(404).json({ message: "No booking history found for this user" });
            return;
        }
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch user booking history" });
    }
};
exports.getUserBookingHistory = getUserBookingHistory;
// Get hotel bookings stats
const getHotelBookingsStats = async (req, res) => {
    const hotelId = parseInt(req.params.hotelId);
    if (isNaN(hotelId)) {
        res.status(400).json({ error: "Invalid hotel ID format" });
        return;
    }
    try {
        const stats = await (0, booking_service_1.getHotelBookingsStatsService)(hotelId);
        if (!stats?.length) {
            res.status(404).json({ message: "No booking statistics available for this hotel" });
            return;
        }
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch hotel booking statistics" });
    }
};
exports.getHotelBookingsStats = getHotelBookingsStats;
// Get upcoming check-ins
const getUpcomingCheckIns = async (req, res) => {
    const days = parseInt(req.query.days || "7");
    if (isNaN(days) || days < 1) {
        res.status(400).json({ error: "Days parameter must be a positive integer" });
        return;
    }
    try {
        const checkIns = await (0, booking_service_1.getUpcomingCheckInsService)(days);
        if (!checkIns?.length) {
            res.status(404).json({ message: `No upcoming check-ins found for the next ${days} days` });
            return;
        }
        res.status(200).json({
            period: `Next ${days} days`,
            count: checkIns.length,
            checkIns,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch upcoming check-ins" });
    }
};
exports.getUpcomingCheckIns = getUpcomingCheckIns;
// Get upcoming check-outs
const getUpcomingCheckOuts = async (req, res) => {
    const days = parseInt(req.query.days || "7");
    if (isNaN(days) || days < 1) {
        res.status(400).json({ error: "Days parameter must be a positive integer" });
        return;
    }
    try {
        const checkOuts = await (0, booking_service_1.getUpcomingCheckOutsService)(days);
        if (!checkOuts?.length) {
            res.status(404).json({ message: `No upcoming check-outs found for the next ${days} days` });
            return;
        }
        res.status(200).json({
            period: `Next ${days} days`,
            count: checkOuts.length,
            checkOuts,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch upcoming check-outs" });
    }
};
exports.getUpcomingCheckOuts = getUpcomingCheckOuts;
const changeRoomController = async (req, res) => {
    try {
        const bookingId = Number(req.params.id);
        const { newRoomId } = req.body;
        if (!newRoomId || isNaN(bookingId)) {
            res.status(400).json({ error: "Invalid booking or room ID" });
            return;
        }
        const message = await (0, booking_service_1.changeRoomService)(bookingId, newRoomId);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to change room" });
    }
};
exports.changeRoomController = changeRoomController;
const updateBookingStatusToConfirmedController = async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId, 10);
        if (isNaN(bookingId)) {
            res.status(400).json({ error: "Invalid booking ID" });
            return;
        }
        const updatedBooking = await (0, booking_service_1.updateBookingStatusToConfirmedService)(bookingId);
        if (!updatedBooking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        res.status(200).json({ message: "Booking status updated to Confirmed", booking: updatedBooking });
    }
    catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateBookingStatusToConfirmedController = updateBookingStatusToConfirmedController;
