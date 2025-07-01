import { Request, Response } from "express";
import {
  getAllHotelsService,
  getHotelByIdService,
  createHotelService,
  updateHotelService,
  deleteHotelService,
} from "./hotel.service";

// GET /hotels
export const getAllHotels = async (_req: Request, res: Response) => {
  try {
    const hotels = await getAllHotelsService();
   res.status(200).json(hotels);
   return
  } catch (error: any) {
  res.status(500).json({ error: error.message || "Failed to fetch hotels" });
  return
  }
};

// GET /hotels/:id
export const getHotelById = async (req: Request, res: Response) => {
  const hotelId = parseInt(req.params.id);
  if (isNaN(hotelId)) {
    res.status(400).json({ error: "Invalid hotel ID" });
    return
  }

  try {
    const hotel = await getHotelByIdService(hotelId);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return
    }
     res.status(200).json(hotel);
     return
  } catch (error: any) {
     res.status(500).json({ error: error.message || "Failed to fetch hotel" });
     return
  }
};

// POST /hotels
export const createHotel = async (req: Request, res: Response) => {
  try {
    const newHotel = await createHotelService(req.body);
 res.status(201).json(newHotel);
 return
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to create hotel" });
    return
  }
};

// PUT /hotels/:id
export const updateHotel = async (req: Request, res: Response) => {
  const hotelId = parseInt(req.params.id);
  if (isNaN(hotelId)) {
    res.status(400).json({ error: "Invalid hotel ID" });
    return
  }

  try {
    const updatedHotel = await updateHotelService(hotelId, req.body);
    if (!updatedHotel) {
      res.status(404).json({ message: "Hotel not found or not updated" });
      return
    }
     res.status(200).json(updatedHotel);
     return
  } catch (error: any) {
     res.status(400).json({ error: error.message || "Failed to update hotel" });
     return
  }
};

// DELETE /hotels/:id
export const deleteHotel = async (req: Request, res: Response) => {
  const hotelId = parseInt(req.params.id);
  if (isNaN(hotelId)) {
     res.status(400).json({ error: "Invalid hotel ID" });
     return
  }

  try {
    const deletedHotel = await deleteHotelService(hotelId);
    if (!deletedHotel) {
      res.status(404).json({ message: "Hotel not found" });
      return
    }
    res.status(200).json({ message: "Hotel deleted successfully" });
    return
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete hotel" });
    return
  }
};
