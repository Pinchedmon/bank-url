/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Получение одной заявки
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        client: true,
        device: true,
        employee: true,
        conditions: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// Создание заявки (должно быть в app/api/applications/route.ts)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, amountRequested, term, deviceId } = body;

    if (!clientId || !amountRequested || !term) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

// Обновление заявки
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, amountRequested, term, employeeId } = body;

    const application = await prisma.application.update({
      where: { id: Number(params.id) },
      data: {
        status,
        amountRequested: amountRequested ? Number(amountRequested) : undefined,
        term: term ? Number(term) : undefined,
        employeeId: employeeId ? Number(employeeId) : undefined,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// Удаление заявки
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.application.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
