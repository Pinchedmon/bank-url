/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, email, fullName, phone, passportData, role } =
      await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId обязателен" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { userId: Number(userId) },
      data: {
        email,
        fullName,
        phone,
        passportData,
        role,
      },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
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
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId обязателен" }, { status: 400 });
    }

    const numericUserId = Number(userId);

    // Удаляем связанные записи в Booking
    const deletedBookings = await prisma.booking.deleteMany({
      where: { userId: numericUserId },
    });
    console.log(`Удалено бронирований: ${deletedBookings.count}`);

    // Удаляем связанные записи в LoyaltyPoint
    const deletedLoyaltyPoints = await prisma.loyaltyPoint.deleteMany({
      where: { userId: numericUserId },
    });
    console.log(`Удалено баллов лояльности: ${deletedLoyaltyPoints.count}`);

    // Удаляем пользователя
    const deletedUser = await prisma.user.delete({
      where: { userId: numericUserId },
    });

    return NextResponse.json(
      { message: "Пользователь и связанные данные удалены", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
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
