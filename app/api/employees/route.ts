/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { role: true },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { fullName, email, roleId } = await request.json();
    const employee = await prisma.employee.create({
      data: {
        fullName,
        email,
        roleId,
        phone: "default-phone", // Replace with actual phone value
        passwordHash: "default-hash", // Replace with actual hashed password
        role: { connect: { id: roleId } }, // Assuming role is connected by ID
      },
    });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
