/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
  }

  try {
    const profile = await prisma.client.findUnique({
      where: { id: parseInt(clientId) },
    });
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { clientId, fullName, email, phone } = await request.json();

    const updatedProfile = await prisma.client.update({
      where: { id: parseInt(clientId) },
      data: { fullName, email, phone },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
