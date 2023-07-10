import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { TicketStatus } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findTicketTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticketInfo = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketRepository.createTicket(ticketInfo);

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  return ticket;
}

const ticketService = { getTicketTypes, getTicketByUserId, createTicket };

export default ticketService;
