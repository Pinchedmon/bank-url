/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/applications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  try {
    const applications = await prisma.application.findMany({
      where: {
        status: searchParams.get("status") || undefined,
        clientId: clientId ? Number(clientId) : undefined,
        OR: searchParams.get("search")
          ? [
              {
                client: {
                  fullName: { contains: searchParams.get("search") || "" },
                },
              },
              {
                client: {
                  email: { contains: searchParams.get("search") || "" },
                },
              },
            ]
          : undefined,
      },
      include: { client: true },
      orderBy: {
        [searchParams.get("sortBy") || "applicationDate"]:
          searchParams.get("sortOrder") || "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, amountRequested, term, deviceId } = body;

    // Более строгая валидация
    if (!clientId || isNaN(clientId)) {
      return NextResponse.json(
        { error: "Неверный ID клиента" },
        { status: 400 }
      );
    }

    if (!amountRequested || isNaN(amountRequested) || amountRequested <= 0) {
      return NextResponse.json(
        { error: "Сумма кредита должна быть положительным числом" },
        { status: 400 }
      );
    }

    if (!term || isNaN(term) || term <= 0 || !Number.isInteger(term)) {
      return NextResponse.json(
        { error: "Срок должен быть целым положительным числом" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        clientId: Number(clientId),
        amountRequested: Number(amountRequested),
        term: Number(term),
        status: "PENDING",
        deviceId: deviceId ? Number(deviceId) : null,
        applicationDate: new Date(),
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Ошибка создания заявки:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
