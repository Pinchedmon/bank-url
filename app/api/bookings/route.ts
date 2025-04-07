/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId обязателен" }, { status: 400 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: Number(userId), // Преобразуем userId в число
      },
      include: {
        flight: true,
      },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// Остальные методы (POST, PUT) остаются без изменений
export async function POST(req: NextRequest) {
  try {
    const { userId, flightId, class: classType, seatCount } = await req.json();

    const flight = await prisma.flight.findUnique({ where: { flightId } });
    if (!flight || flight.status !== "SCHEDULED") {
      return NextResponse.json({ error: "Рейс недоступен" }, { status: 404 });
    }

    const availableSeats =
      classType === "ECONOMY" ? flight.economySeats : flight.vipSeats;
    if (seatCount > availableSeats) {
      return NextResponse.json({ error: "Недостаточно мест" }, { status: 400 });
    }

    const totalPrice =
      seatCount *
      (classType === "ECONOMY" ? flight.economyPrice : flight.vipPrice);

    const booking = await prisma.booking.create({
      data: {
        userId,
        flightId,
        class: classType,
        seatCount,
        totalPrice,
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

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при бронировании" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { bookingId, status } = await req.json();
    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId обязателен" },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingId: Number(bookingId) },
      data: {
        status,
        cancelledAt: status === "CANCELLED" ? new Date() : null,
      },
      include: { flight: true }, // Включаем flight для一致ности с GET
    });
    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении бронирования:", error);
    return NextResponse.json(
      {
        error:
          "Ошибка при обновлении: " +
          (error instanceof Error ? error.message : "Неизвестная ошибка"),
      },
      { status: 500 }
    );
  }
}
