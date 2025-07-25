"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = require("./room.controller");
const roomRouter = (0, express_1.Router)();
// GET routes
roomRouter.get("/rooms", room_controller_1.getAllRooms); // GET /rooms
roomRouter.get("/room/available", room_controller_1.getAvailableRooms); // GET /rooms/available
roomRouter.get("/room/active-bookings", room_controller_1.getRoomsWithActiveBookings); // GET /rooms/active-bookings
roomRouter.get("/room/:hotel/:id", room_controller_1.getRoomsByHotelId); // GET /rooms/hotel/:hotelId
roomRouter.get("/room/:hotel/:Id/stats", room_controller_1.getHotelRoomsWithStats); // GET /rooms/hotel/:hotelId/stats
roomRouter.get("/room/:id", room_controller_1.getRoomById); // GET /rooms/:id
roomRouter.get("/room/:id/history", room_controller_1.getRoomWithBookingHistory); // GET /rooms/:id/history
// POST routes
roomRouter.post("/rooms", room_controller_1.createRoom); // POST /rooms
// PUT routes
roomRouter.put("/rooms/:id", room_controller_1.updateRoom); // PUT /rooms/:id
roomRouter.get("/rooms/available", room_controller_1.getAvailableRooms);
// PATCH routes
roomRouter.patch("/room/:id/availability", room_controller_1.updateRoomAvailability); // PATCH /rooms/:id/availability
// DELETE routes
roomRouter.delete("/rooms/:id", room_controller_1.deleteRoom); // DELETE /rooms/:id
exports.default = roomRouter;
