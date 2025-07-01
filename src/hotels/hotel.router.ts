import { Router } from "express";
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from "./hotel.controller";

 export const hotelRouter = Router();

hotelRouter.get("/hotels", getAllHotels);
hotelRouter.get("/hotel/:id", getHotelById);
hotelRouter.post("/hotel", createHotel);
hotelRouter.put("/hotel/:id", updateHotel);
hotelRouter.delete("/hotel/:id", deleteHotel);


