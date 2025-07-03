import { Router } from "express";
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from "./hotel.controller";
import {
  adminOnly,
  userOnly,
  anyAuthenticatedUser,
} from "../middleware/bearAuth";
 export const hotelRouter = Router();

hotelRouter.get("/hotels", getAllHotels);
hotelRouter.get("/hotel/:id", getHotelById);
hotelRouter.post("/hotel",adminOnly, createHotel);
hotelRouter.put("/hotel/:id",adminOnly, updateHotel);
hotelRouter.delete("/hotel/:id", adminOnly,deleteHotel);


