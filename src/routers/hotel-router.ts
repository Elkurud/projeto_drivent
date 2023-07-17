import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelsWithRooms } from "@/controllers/hotel-controller";

const hotelRouter = Router();

hotelRouter
.all('/*', authenticateToken)
.get('/hotels', getHotels)
.get('/hotel/:id', getHotelsWithRooms)

export { hotelRouter }