import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookRoom, listBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
.all('/*', authenticateToken)
.get('/booking', listBooking)
.post('/booking', bookRoom)
.put('/booking/:bookingId')