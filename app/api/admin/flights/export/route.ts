/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    const flights = await prisma.flight.findMany();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Рейсы");
    worksheet.columns = [
      { header: "ID", key: "flightId" },
      { header: "Номер", key: "flightNumber" },
      { header: "Откуда", key: "departureCity" },
      { header: "Куда", key: "arrivalCity" },
      { header: "Вылет", key: "departureTime" },
      { header: "Прилёт", key: "arrivalTime" },
      { header: "Эконом места", key: "economySeats" },
      { header: "VIP места", key: "vipSeats" },
      { header: "Цена эконом", key: "economyPrice" },
      { header: "Цена VIP", key: "vipPrice" },
      { header: "Статус", key: "status" },
    ];
    worksheet.addRows(flights);
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=flights.xlsx",
      },
    });
  } catch (error) {
    console.error("Ошибка при экспорте рейсов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
