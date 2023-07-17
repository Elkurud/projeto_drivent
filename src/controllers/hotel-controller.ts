import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req:AuthenticatedRequest, res:Response) {

    const { userId } = req;

    try {
        const hotels = await hotelsService.getHotels(userId)
        return res.status(httpStatus.OK).send(hotels);
    } catch (e) {
        if (e.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
    }

}

export async function getHotelsWithRooms(req:AuthenticatedRequest, res:Response) {

    const { userId } = req;
    const { hotelId } = req.params;

    try {

        const hotels = await hotelsService.getHotelsWithRooms(userId, Number(hotelId));

        return res.status(httpStatus.OK).send(hotels);
    } catch (e) {

    }
}