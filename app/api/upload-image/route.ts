/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/upload-image/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const clientId = formData.get("clientId") as string;

    if (!file || !clientId) {
      return NextResponse.json(
        { error: "Missing file or clientId" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), "public/uploads", fileName);
    await writeFile(path, buffer);

    const imageUrl = `/uploads/${fileName}`;
    await prisma.client.update({
      where: { id: parseInt(clientId) },
      data: { profileImage: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
