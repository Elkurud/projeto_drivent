import { Router } from "express";
import { authenticateToken } from "@/middlewares";

const hotelRouter = Router();

hotelRouter
.all('/*', authenticateToken)
.get('/hotels')
.get('/hotel/:id')

export { hotelRouter }