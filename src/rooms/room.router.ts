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
roomRouter.get("/rooms", getAllRooms);                                    // GET /rooms
roomRouter.get("/room/available", getAvailableRooms);                     // GET /rooms/available
roomRouter.get("/room/active-bookings", getRoomsWithActiveBookings);      // GET /rooms/active-bookings
roomRouter.get("/room/:hotel/:id", getRoomsByHotelId);                // GET /rooms/hotel/:hotelId
roomRouter.get("/room/:hotel/:Id/stats", getHotelRoomsWithStats);     // GET /rooms/hotel/:hotelId/stats
roomRouter.get("/room/:id", getRoomById);                                 // GET /rooms/:id
roomRouter.get("/room/:id/history", getRoomWithBookingHistory);           // GET /rooms/:id/history

// POST routes
roomRouter.post("/rooms",  createRoom);     // POST /rooms

// PUT routes
roomRouter.put("/rooms/:id",  updateRoom); // PUT /rooms/:id
roomRouter.get("/rooms/available", getAvailableRooms)

// PATCH routes
roomRouter.patch("/room/:id/availability", updateRoomAvailability); // PATCH /rooms/:id/availability

// DELETE routes
roomRouter.delete("/rooms/:id", deleteRoom);                              // DELETE /rooms/:id

export default roomRouter;