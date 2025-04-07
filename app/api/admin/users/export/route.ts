/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Пользователи");
    worksheet.columns = [
      { header: "ID", key: "userId" },
      { header: "Email", key: "email" },
      { header: "Имя", key: "fullName" },
      // Добавь другие поля, если нужно
    ];
    worksheet.addRows(users);
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=users.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
