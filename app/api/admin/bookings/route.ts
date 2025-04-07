/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      include: { flight: true, user: true }, // Включаем связанные данные для отчёта
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении бронирований:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const {
      bookingId,
      userId,
      flightId,
      class: classType,
      seatCount,
      totalPrice,
      status,
    } = await req.json();
    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId обязателен" },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingId: Number(bookingId) },
      data: {
        userId,
        flightId,
        class: classType,
        seatCount,
        totalPrice,
        status,
        cancelledAt: status === "CANCELLED" ? new Date() : null,
      },
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

export async function DELETE(req: NextRequest) {
  try {
    const bookingId = req.nextUrl.searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId обязателен" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { bookingId: Number(bookingId) },
    });
    return NextResponse.json(
      { message: "Бронирование удалено" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении бронирования:", error);
    return NextResponse.json(
      {
        error:
          "Ошибка при удалении: " +
          (error instanceof Error ? error.message : "Неизвестная ошибка"),
      },
      { status: 500 }
    );
  }
}
