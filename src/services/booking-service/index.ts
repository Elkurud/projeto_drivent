import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import { cannotBookingError } from '@/errors/booking-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function checkTicket(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw cannotBookingError();
  
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  
    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      throw cannotBookingError();
    }
}

async function checkBooking(roomId: number) {
    const room = await roomRepository.findById(roomId);
    const bookings = await bookingRepository.findByRoomId(roomId);
  
    if (!room) throw notFoundError();
    if (room.capacity <= bookings.length) throw cannotBookingError();
}

async function getBooking(userId: number) {
    const booking = await bookingRepository.findByUserId(userId);
    if (!booking) throw notFoundError();
  
    return booking;
}

async function bookRoomById(userId: number, roomId: number) {
    if (!roomId) throw badRequestError();
  
    await checkTicket(userId);
    await checkBooking(roomId);
  
    return bookingRepository.create(roomId, userId);
}  

const bookingService = {
    getBooking,
    bookRoomById,
    checkBooking,
    checkTicket
};
  
export default bookingService;