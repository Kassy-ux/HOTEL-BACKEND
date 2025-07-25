"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getHotelById = exports.getAllHotels = void 0;
const hotel_service_1 = require("./hotel.service");
// GET /hotels
const getAllHotels = async (_req, res) => {
    try {
        const hotels = await (0, hotel_service_1.getAllHotelsService)();
        res.status(200).json(hotels);
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch hotels" });
        return;
    }
};
exports.getAllHotels = getAllHotels;
// GET /hotels/:id
const getHotelById = async (req, res) => {
    const hotelId = parseInt(req.params.id);
    if (isNaN(hotelId)) {
        res.status(400).json({ error: "Invalid hotel ID" });
        return;
    }
    try {
        const hotel = await (0, hotel_service_1.getHotelByIdService)(hotelId);
        if (!hotel) {
            res.status(404).json({ message: "Hotel not found" });
            return;
        }
        res.status(200).json(hotel);
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch hotel" });
        return;
    }
};
exports.getHotelById = getHotelById;
// POST /hotels
const createHotel = async (req, res) => {
    try {
        const newHotel = await (0, hotel_service_1.createHotelService)(req.body);
        res.status(201).json(newHotel);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Failed to create hotel" });
        return;
    }
};
exports.createHotel = createHotel;
// PUT /hotels/:id
const updateHotel = async (req, res) => {
    const hotelId = parseInt(req.params.id);
    if (isNaN(hotelId)) {
        res.status(400).json({ error: "Invalid hotel ID" });
        return;
    }
    try {
        const updatedHotel = await (0, hotel_service_1.updateHotelService)(hotelId, req.body);
        if (!updatedHotel) {
            res.status(404).json({ message: "Hotel not found or not updated" });
            return;
        }
        res.status(200).json(updatedHotel);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Failed to update hotel" });
        return;
    }
};
exports.updateHotel = updateHotel;
// DELETE /hotels/:id
const deleteHotel = async (req, res) => {
    const hotelId = parseInt(req.params.id);
    if (isNaN(hotelId)) {
        res.status(400).json({ error: "Invalid hotel ID" });
        return;
    }
    try {
        const deletedHotel = await (0, hotel_service_1.deleteHotelService)(hotelId);
        if (!deletedHotel) {
            res.status(404).json({ message: "Hotel not found" });
            return;
        }
        res.status(200).json({ message: "Hotel deleted successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete hotel" });
        return;
    }
};
exports.deleteHotel = deleteHotel;
