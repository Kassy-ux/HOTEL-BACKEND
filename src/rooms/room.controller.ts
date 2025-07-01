import { Request, Response } from "express";
import { 
  getAllRoomsService, 
  getRoomByIdService, 
  getRoomsByHotelIdService,
  getAvailableRoomsService,
  createNewRoomService, 
  updateRoomService, 
  deleteRoomService,
  updateRoomAvailabilityService,
  getRoomWithBookingHistoryService,
  getRoomsWithActiveBookingsService,
  getHotelRoomsWithStatsService
} from "./room.service";

// GET /rooms - Get all rooms
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await getAllRoomsService();
    if (rooms) {
      res.status(200).json(rooms);
    } else {
      res.status(404).json({ message: "No rooms found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /rooms/:id - Get room by ID
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const room = await getRoomByIdService(id);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /rooms/hotel/:hotelId - Get rooms by hotel ID
export const getRoomsByHotelId = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    if (isNaN(hotelId)) {
      res.status(400).json({ message: "Invalid hotel ID" });
      return;
    }

    const rooms = await getRoomsByHotelIdService(hotelId);
    if (rooms && rooms.length > 0) {
      res.status(200).json(rooms);
    } else {
      res.status(404).json({ message: "No rooms found for this hotel" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /rooms/available - Get available rooms
export const getAvailableRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await getAvailableRoomsService();
    if (rooms && rooms.length > 0) {
      res.status(200).json(rooms);
    } else {
      res.status(404).json({ message: "No available rooms found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /rooms - Create new room
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomData = req.body;
    const message = await createNewRoomService(roomData);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /rooms/:id - Update room
export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const roomData = req.body;
    const message = await updateRoomService(id, roomData);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /rooms/:id/availability - Update room availability
export const updateRoomAvailability = async (req: Request, res: Response): Promise<void> => {
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

    const message = await updateRoomAvailabilityService(id, isAvailable);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /rooms/:id - Delete room
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const message = await deleteRoomService(id);
    res.status(200).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /rooms/:id/history - Get room with booking history
export const getRoomWithBookingHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid room ID" });
      return;
    }

    const room = await getRoomWithBookingHistoryService(id);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /rooms/active-bookings - Get rooms with active bookings
export const getRoomsWithActiveBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await getRoomsWithActiveBookingsService();
    if (rooms && rooms.length > 0) {
      res.status(200).json(rooms);
    } else {
      res.status(404).json({ message: "No rooms with active bookings found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /rooms/hotel/:hotelId/stats - Get hotel rooms with statistics
export const getHotelRoomsWithStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotelId = parseInt(req.params.hotelId);
    if (isNaN(hotelId)) {
      res.status(400).json({ message: "Invalid hotel ID" });
      return;
    }

    const hotelWithStats = await getHotelRoomsWithStatsService(hotelId);
    if (hotelWithStats) {
      res.status(200).json(hotelWithStats);
    } else {
      res.status(404).json({ message: "Hotel not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};