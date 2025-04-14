/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/export-excel/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: { client: true, employee: true },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Клиент", key: "clientName", width: 20 },
      { header: "Сумма", key: "amountRequested", width: 15 },
      { header: "Статус", key: "status", width: 15 },
      { header: "Дата заявки", key: "applicationDate", width: 20 },
      { header: "Сотрудник", key: "employeeName", width: 20 },
    ];

    applications.forEach((app) => {
      worksheet.addRow({
        id: app.id,
        clientName: app.client.fullName,
        amountRequested: app.amountRequested,
        status: app.status,
        applicationDate: new Date(app.applicationDate).toLocaleDateString(),
        employeeName: app.employee?.fullName || "Не назначен",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=applications.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
