import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createTicket, getTickets, getTicketTypes } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/tickets', getTickets)
  .get('/tickets/types', getTicketTypes)
  .post('tickets', createTicket);

export { ticketsRouter };
