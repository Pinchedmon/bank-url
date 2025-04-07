/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    const flights = await prisma.flight.findMany();
    return NextResponse.json(flights, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении рейсов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      flightNumber,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      economySeats,
      vipSeats,
      economyPrice,
      vipPrice,
      status,
    } = await req.json();

    if (
      !flightNumber ||
      !departureCity ||
      !arrivalCity ||
      !departureTime ||
      !arrivalTime
    ) {
      return NextResponse.json(
        { error: "Все обязательные поля должны быть заполнены" },
        { status: 400 }
      );
    }

    const newFlight = await prisma.flight.create({
      data: {
        flightNumber,
        departureCity,
        arrivalCity,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        economySeats,
        vipSeats,
        economyPrice,
        vipPrice,
        status,
      },
    });
    return NextResponse.json(newFlight, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании рейса:", error);
    return NextResponse.json(
      {
        error:
          "Ошибка при создании: " +
          (error instanceof Error ? error.message : "Неизвестная ошибка"),
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const {
      flightId,
      flightNumber,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      economySeats,
      vipSeats,
      economyPrice,
      vipPrice,
      status,
    } = await req.json();
    if (!flightId) {
      return NextResponse.json(
        { error: "flightId обязателен" },
        { status: 400 }
      );
    }

    const updatedFlight = await prisma.flight.update({
      where: { flightId: Number(flightId) },
      data: {
        flightNumber,
        departureCity,
        arrivalCity,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        economySeats,
        vipSeats,
        economyPrice,
        vipPrice,
        status,
      },
    });
    return NextResponse.json(updatedFlight, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении рейса:", error);
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
    const flightId = req.nextUrl.searchParams.get("flightId");
    if (!flightId) {
      return NextResponse.json(
        { error: "flightId обязателен" },
        { status: 400 }
      );
    }

    const numericFlightId = Number(flightId);

    // Удаляем связанные бронирования
    await prisma.booking.deleteMany({
      where: { flightId: numericFlightId },
    });

    // Удаляем рейс
    await prisma.flight.delete({
      where: { flightId: numericFlightId },
    });

    return NextResponse.json(
      { message: "Рейс и связанные бронирования удалены" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении рейса:", error);
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
