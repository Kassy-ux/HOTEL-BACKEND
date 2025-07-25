"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotelRoomsWithStats = exports.getRoomsWithActiveBookings = exports.getRoomWithBookingHistory = exports.deleteRoom = exports.updateRoomAvailability = exports.updateRoom = exports.createRoom = exports.getAvailableRooms = exports.getRoomsByHotelId = exports.getRoomById = exports.getAllRooms = void 0;
const room_service_1 = require("./room.service");
// GET /rooms - Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await (0, room_service_1.getAllRoomsService)();
        if (rooms) {
            res.status(200).json(rooms);
        }
        else {
            res.status(404).json({ message: "No rooms found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllRooms = getAllRooms;
// GET /rooms/:id - Get room by ID
const getRoomById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid room ID" });
            return;
        }
        const room = await (0, room_service_1.getRoomByIdService)(id);
        if (room) {
            res.status(200).json(room);
        }
        else {
            res.status(404).json({ message: "Room not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRoomById = getRoomById;
// GET /rooms/hotel/:hotelId - Get rooms by hotel ID
const getRoomsByHotelId = async (req, res) => {
    try {
        const hotelId = parseInt(req.params.id);
        if (isNaN(hotelId)) {
            res.status(400).json({ message: "Invalid hotel ID" });
            return;
        }
        const rooms = await (0, room_service_1.getRoomsByHotelIdService)(hotelId);
        if (rooms && rooms.length > 0) {
            res.status(200).json(rooms);
        }
        else {
            res.status(404).json({ message: "No rooms found for this hotel" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRoomsByHotelId = getRoomsByHotelId;
// GET /rooms/available - Get available rooms
const getAvailableRooms = async (req, res) => {
    try {
        const rooms = await (0, room_service_1.getAvailableRoomsService)();
        if (rooms && rooms.length > 0) {
            res.status(200).json(rooms);
        }
        else {
            res.status(404).json({ message: "No available rooms found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAvailableRooms = getAvailableRooms;
// POST /rooms - Create new room
const createRoom = async (req, res) => {
    try {
        const roomData = req.body;
        const message = await (0, room_service_1.createNewRoomService)(roomData);
        res.status(201).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createRoom = createRoom;
// PUT /rooms/:id - Update room
const updateRoom = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid room ID" });
            return;
        }
        const roomData = req.body;
        const message = await (0, room_service_1.updateRoomService)(id, roomData);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateRoom = updateRoom;
// PATCH /rooms/:id/availability - Update room availability
const updateRoomAvailability = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid room ID" });
            return;
        }
        const { isAvailable } = req.body;
        if (typeof isAvailable !== 'boolean') {
            res.status(400).json({ message: "isAvailable must be a boolean value" });
            return;
        }
        const message = await (0, room_service_1.updateRoomAvailabilityService)(id, isAvailable);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateRoomAvailability = updateRoomAvailability;
// DELETE /rooms/:id - Delete room
const deleteRoom = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid room ID" });
            return;
        }
        const message = await (0, room_service_1.deleteRoomService)(id);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteRoom = deleteRoom;
// GET /rooms/:id/history - Get room with booking history
const getRoomWithBookingHistory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid room ID" });
            return;
        }
        const room = await (0, room_service_1.getRoomWithBookingHistoryService)(id);
        if (room) {
            res.status(200).json(room);
        }
        else {
            res.status(404).json({ message: "Room not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRoomWithBookingHistory = getRoomWithBookingHistory;
// GET /rooms/active-bookings - Get rooms with active bookings
const getRoomsWithActiveBookings = async (req, res) => {
    try {
        const rooms = await (0, room_service_1.getRoomsWithActiveBookingsService)();
        if (rooms && rooms.length > 0) {
            res.status(200).json(rooms);
        }
        else {
            res.status(404).json({ message: "No rooms with active bookings found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRoomsWithActiveBookings = getRoomsWithActiveBookings;
// GET /rooms/hotel/:hotelId/stats - Get hotel rooms with statistics
const getHotelRoomsWithStats = async (req, res) => {
    try {
        const hotelId = parseInt(req.params.hotelId);
        if (isNaN(hotelId)) {
            res.status(400).json({ message: "Invalid hotel ID" });
            return;
        }
        const hotelWithStats = await (0, room_service_1.getHotelRoomsWithStatsService)(hotelId);
        if (hotelWithStats) {
            res.status(200).json(hotelWithStats);
        }
        else {
            res.status(404).json({ message: "Hotel not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getHotelRoomsWithStats = getHotelRoomsWithStats;
