import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createBooking, cancelBooking } from "../lib/handlers/bookings";

const prisma = new PrismaClient();

describe("createBooking", () => {
  let userId: number;
  let flightId: number;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: "booking@example.com",
        passwordHash: "hash",
        fullName: "Booking User",
      },
    });
    userId = user.userId;

    const flight = await prisma.flight.create({
      data: {
        flightNumber: "CD456",
        departureCity: "Berlin",
        arrivalCity: "Rome",
        departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
        arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 26),
        economySeats: 5,
        vipSeats: 2,
        economyPrice: 150,
        vipPrice: 300,
      },
    });
    flightId = flight.flightId;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.flight.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("создает бронирование, если достаточно мест", async () => {
    const booking = await createBooking({
      userId,
      flightId,
      classType: "ECONOMY",
      seatCount: 2,
    });

    expect(booking).toBeDefined();
    expect(booking.totalPrice).toBe(300);
    expect(booking.status).toBe("ACTIVE");

    const updatedFlight = await prisma.flight.findUnique({
      where: { flightId },
    });
    expect(updatedFlight?.economySeats).toBe(3);
  });

  it("выбрасывает ошибку при нехватке мест", async () => {
    await expect(() =>
      createBooking({
        userId,
        flightId,
        classType: "ECONOMY",
        seatCount: 10,
      })
    ).rejects.toThrow("Not enough economy seats available.");
  });
});

describe("cancelBooking", () => {
  let userId: number;
  let flightId: number;
  let bookingId: number;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: "cancel@example.com",
        passwordHash: "hash",
        fullName: "Cancel User",
      },
    });
    userId = user.userId;

    const flight = await prisma.flight.create({
      data: {
        flightNumber: "EF789",
        departureCity: "London",
        arrivalCity: "Madrid",
        departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
        arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 26),
        economySeats: 50,
        vipSeats: 5,
        economyPrice: 180,
        vipPrice: 400,
      },
    });
    flightId = flight.flightId;

    const booking = await prisma.booking.create({
      data: {
        userId,
        flightId,
        class: "VIP",
        seatCount: 1,
        totalPrice: 400,
      },
    });
    bookingId = booking.bookingId;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.flight.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("отменяет бронирование и возвращает места", async () => {
    const updatedBooking = await cancelBooking(bookingId);
    expect(updatedBooking.status).toBe("CANCELLED");
    expect(updatedBooking.cancelledAt).not.toBeNull();

    const updatedFlight = await prisma.flight.findUnique({
      where: { flightId },
    });
    expect(updatedFlight?.vipSeats).toBe(6);
  });
});
