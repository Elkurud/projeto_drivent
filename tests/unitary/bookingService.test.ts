import enrollmentRepository from "@/repositories/enrollment-repository";
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import ticketRepository from "@/repositories/ticket-repository";
import bookingService from "@/services/booking-service";
import { cannotBookingError } from "@/errors/booking-error";
import { notFoundError } from "@/errors";
import {
    enrollmentWithAddressReturn,
    findBookingByRoomIdNoCapacityReturn,
    findBookingByRoomIdReturn,
    findRoomByIdNoCapacityReturn,
    findRoomByIdReturn,
    findTicketByEnrollmentIdReturn,
    getBookingReturn,
} from '../factories/booking-factory';

describe('getBooking function', () => {
    it('should return the booking for the given user id', async () => {
      const userId = 1;
      const booking = getBookingReturn();
  
      jest.spyOn(bookingRepository, 'findByUserId').mockResolvedValue(booking);
  
      const result = await bookingService.getBooking(userId);
  
      expect(bookingRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(booking);
    });
  
    it('should throw notFoundError if the booking for the given user id is not found', async () => {
      const userId = 1;
  
      jest.spyOn(bookingRepository, 'findByUserId').mockResolvedValue(null);
  
      await expect(bookingService.getBooking(userId)).rejects.toEqual(notFoundError());
      expect(bookingRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
});
  
describe('bookingRoomById function', () => {
    it('should create a booking for the given user and room', async () => {
      const userId = 1;
      const roomId = 1;
      const booking = getBookingReturn();

      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
      jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockResolvedValue(findTicketByEnrollmentIdReturn());
  
      jest.spyOn(bookingService, 'checkBooking').mockResolvedValue(undefined);
      jest.spyOn(roomRepository, 'findById').mockResolvedValue(findRoomByIdReturn());
      jest.spyOn(bookingRepository, 'findByRoomId').mockResolvedValue(findBookingByRoomIdReturn());
  
      jest.spyOn(bookingRepository, 'create').mockResolvedValue(booking);
  
      const result = await bookingService.bookRoomById(userId, roomId);
  
      expect(bookingRepository.create).toHaveBeenCalledWith({ userId, roomId });
      expect(result).toEqual(booking);
    });
});
  
  
describe('checkValidBooking function', () => {
    it('should return error in find room by id', async () => {
      const roomId = 1;
  
      jest.spyOn(roomRepository, 'findById').mockResolvedValue(null);
      jest.spyOn(bookingRepository, 'findByRoomId').mockResolvedValue(findBookingByRoomIdReturn());
  
      await expect(bookingService.checkBooking(roomId)).rejects.toEqual(notFoundError());
    });
  
    it('should return error in fin booking by Room Id', async () => {
      const roomId = 1;
  
      jest.spyOn(roomRepository, 'findById').mockResolvedValue(findRoomByIdNoCapacityReturn());
      jest.spyOn(bookingRepository, 'findByRoomId').mockResolvedValue(findBookingByRoomIdNoCapacityReturn());
  
      await expect(bookingService.checkBooking(roomId)).rejects.toEqual(cannotBookingError());
    });
});