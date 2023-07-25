import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";

export async function listBooking(req: AuthenticatedRequest, res: Response) {
    
    try {
        const { userId } = req;
        const booking = await bookingService.getBooking(userId);
        return res.status(httpStatus.OK).send({
            id: booking.id,
            Room: booking.Room
        });
    } catch (error) {
        return res.status(httpStatus.NOT_FOUND).send({});
    }
}

export async function bookRoom(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req;
      const { roomId } = req.body as Record<string, number>;
  
      const booking = await bookingService.bookRoomById(userId, roomId);
  
      return res.status(httpStatus.OK).send({
        bookingId: booking.id,
      });
    } catch (error) {
    }
  }