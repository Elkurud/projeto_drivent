import httpStatus from "http-status";
import faker from "@faker-js/faker";
import supertest from "supertest";
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from "@/app";
import { 
    createEnrollmentWithAddress,
    createPayment,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createUser 
} from "../factories";
import { createHotel, createRoomWithHotelId } from "../factories/hotel-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);


describe('GET /hotels', () => {
    it('should respond with 401 if no token is sent', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with 401 if token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with 401 if no session is found for the given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with 404 if user ticket is remote ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with 404 if user has no enrollment ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const ticketType = await createTicketTypeRemote();
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with 200 and list hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const createdHotel = await createHotel();
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.OK);
  
        expect(response.body).toEqual([
          {
            id: createdHotel.id,
            name: createdHotel.name,
            image: createdHotel.image,
            createdAt: createdHotel.createdAt.toISOString(),
            updatedAt: createdHotel.updatedAt.toISOString(),
          },
        ]);
      });
  
      it('should respond with 404 and an empty array', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
        /* expect(response.body).toEqual([]); */
      });
    });
  });
  
  describe('GET /hotels/:hotelId', () => {
    it('should respond with 401 if no token is sent', async () => {
      const response = await server.get('/hotels/1');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with 401 token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with 401 if no session is found for the given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with 404 if user ticket is remote ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        //Hoteis no banco
  
        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with 404 if user has no enrollment ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const ticketType = await createTicketTypeRemote();
  
        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with 404 if hotel id is invalid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const createdHotel = await createHotel();
  
        const response = await server.get('/hotels/100').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });
  
      it('should respond with 200 and list hotel with rooms', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const createdHotel = await createHotel();
  
        const createdRoom = await createRoomWithHotelId(createdHotel.id);
  
        const response = await server.get(`/hotels/${createdHotel.id}`).set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.OK);
  
        expect(response.body).toEqual({
          id: createdHotel.id,
          name: createdHotel.name,
          image: createdHotel.image,
          createdAt: createdHotel.createdAt.toISOString(),
          updatedAt: createdHotel.updatedAt.toISOString(),
          Rooms: [
            {
              id: createdRoom.id,
              name: createdRoom.name,
              capacity: createdRoom.capacity,
              hotelId: createdHotel.id,
              createdAt: createdRoom.createdAt.toISOString(),
              updatedAt: createdRoom.updatedAt.toISOString(),
            },
          ],
        });
      });
  
      it('should respond with 404 and list hotel with no rooms', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
  
        const createdHotel = await createHotel();
  
        const response = await server.get(`/hotels/${createdHotel.id}`).set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
  
        expect(response.body).toEqual({
          id: createdHotel.id,
          name: createdHotel.name,
          image: expect.any(String),
          createdAt: createdHotel.createdAt.toISOString(),
          updatedAt: createdHotel.updatedAt.toISOString(),
          Rooms: [],
        }); 
      });
    });
  });