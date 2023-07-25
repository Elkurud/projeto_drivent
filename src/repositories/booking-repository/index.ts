import { prisma } from '@/config';

async function findByUserId(userId: number) {
    return prisma.booking.findFirst({
      where: {
        userId,
      },
      include: {
        Room: true,
      },
    });
}

async function findByRoomId(roomId: number) {
    return prisma.booking.findMany({
      where: {
        roomId,
      },
      include: {
        Room: true,
      },
    });
}

async function create(roomId: number, userId: number ) {
    return prisma.booking.create({
      data: {
        roomId,
        userId,
      },
    });
}

const bookingRepository = {
    findByUserId,
    findByRoomId,
    create,
};
  
export default bookingRepository;