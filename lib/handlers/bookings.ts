import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createBooking({
  userId,
  flightId,
  classType,
  seatCount,
}: {
  userId: number;
  flightId: number;
  classType: "ECONOMY" | "VIP";
  seatCount: number;
}) {
  const flight = await prisma.flight.findUnique({ where: { flightId } });
  if (!flight) throw new Error("Flight not found");

  const availableSeats =
    classType === "ECONOMY" ? flight.economySeats : flight.vipSeats;
  if (seatCount > availableSeats) {
    throw new Error(
      "Not enough " + classType.toLowerCase() + " seats available."
    );
  }

  const price = classType === "ECONOMY" ? flight.economyPrice : flight.vipPrice;
  const totalPrice = seatCount * price;

  const booking = await prisma.booking.create({
    data: {
      userId,
      flightId,
      class: classType,
      seatCount,
      totalPrice,
      status: "ACTIVE",
    },
  });

  await prisma.flight.update({
    where: { flightId },
    data: {
      economySeats:
        classType === "ECONOMY"
          ? flight.economySeats - seatCount
          : flight.economySeats,
      vipSeats:
        classType === "VIP" ? flight.vipSeats - seatCount : flight.vipSeats,
    },
  });

  return booking;
}

export async function cancelBooking(bookingId: number) {
  const booking = await prisma.booking.findUnique({ where: { bookingId } });
  if (!booking) throw new Error("Booking not found");

  const updatedBooking = await prisma.booking.update({
    where: { bookingId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });

  const flight = await prisma.flight.findUnique({
    where: { flightId: booking.flightId },
  });
  if (!flight) throw new Error("Flight not found");

  await prisma.flight.update({
    where: { flightId: booking.flightId },
    data: {
      economySeats:
        booking.class === "ECONOMY"
          ? flight.economySeats + booking.seatCount
          : flight.economySeats,
      vipSeats:
        booking.class === "VIP"
          ? flight.vipSeats + booking.seatCount
          : flight.vipSeats,
    },
  });

  return updatedBooking;
}
