import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createTicket, getTickets, getTicketTypes } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .get('/tickets', authenticateToken, getTickets)
  .get('/tickets/types', authenticateToken, getTicketTypes)
  .post('tickets', authenticateToken, createTicket);

export { ticketsRouter };
