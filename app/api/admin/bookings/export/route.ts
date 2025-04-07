/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      include: { flight: true, user: true },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Бронирования");
    worksheet.columns = [
      { header: "ID", key: "bookingId" },
      { header: "User ID", key: "userId" },
      { header: "Flight ID", key: "flightId" },
      { header: "Класс", key: "class" },
      { header: "Места", key: "seatCount" },
      { header: "Стоимость", key: "totalPrice" },
      { header: "Статус", key: "status" },
      { header: "Создано", key: "createdAt" },
      { header: "Отменено", key: "cancelledAt" },
    ];
    worksheet.addRows(bookings);
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=bookings.xlsx",
      },
    });
  } catch (error) {
    console.error("Ошибка при экспорте бронирований:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
