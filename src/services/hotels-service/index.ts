import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { hotelsUnableToListError } from "@/errors/hotels-could-not-be-listed-error";

async function listHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollment) {
        throw notFoundError();
    }
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw hotelsUnableToListError();
    }
}

async function getHotels(userId: number) {
    await listHotels(userId)

    const hotels = await hotelRepository.findHotels();
    if (!hotels || hotels.length === 0) {
        throw notFoundError();
    }

    return hotels;
}


async function getHotelsWithRooms(userId: number, hotelId: number) {
    await listHotels(userId)

    const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

    if (!hotel || hotel.Rooms.length === 0) {
        throw notFoundError();
    }
    return hotel;
}

const hotelsService = { getHotels, getHotelsWithRooms, listHotels }

export default hotelsService;