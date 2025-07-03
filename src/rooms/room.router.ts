import { Router } from "express";
import { 
  getAllRooms, 
  getRoomById, 
  getRoomsByHotelId,
  getAvailableRooms,
  createRoom, 
  updateRoom, 
  updateRoomAvailability,
  deleteRoom,
  getRoomWithBookingHistory,
  getRoomsWithActiveBookings,
  getHotelRoomsWithStats
} from "./room.controller";
import {
  adminOnly,
  userOnly,
  anyAuthenticatedUser,
} from "../middleware/bearAuth";

const roomRouter = Router();

// GET routes
roomRouter.get("/rooms",adminOnly, getAllRooms);                                    // GET /rooms
roomRouter.get("/room/available", getAvailableRooms);                     // GET /rooms/available
roomRouter.get("/room/active-bookings",adminOnly, getRoomsWithActiveBookings);      // GET /rooms/active-bookings
roomRouter.get("/room/:hotel/:id", getRoomsByHotelId);                // GET /rooms/hotel/:hotelId
roomRouter.get("/room/:hotel/:Id/stats", getHotelRoomsWithStats);     // GET /rooms/hotel/:hotelId/stats
roomRouter.get("/room/:id", getRoomById);                                 // GET /rooms/:id
roomRouter.get("/room/:id/history", getRoomWithBookingHistory);           // GET /rooms/:id/history

// POST routes
roomRouter.post("/room", adminOnly, createRoom);     // POST /rooms

// PUT routes
roomRouter.put("/room/:id", adminOnly, updateRoom); // PUT /rooms/:id

// PATCH routes
roomRouter.patch("/room/:id/availability", updateRoomAvailability); // PATCH /rooms/:id/availability

// DELETE routes
roomRouter.delete("/room/:id",adminOnly, deleteRoom);                              // DELETE /rooms/:id

export default roomRouter;