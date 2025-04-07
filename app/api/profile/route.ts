import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email обязателен" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    );
  }

  return NextResponse.json(user, { status: 200 });
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const passportData = formData.get("passportData") as string;
    const profileImageFile = formData.get("profileImage") as File | null;

    if (!email) {
      return NextResponse.json({ error: "Email обязателен" }, { status: 400 });
    }

    let profileImagePath = undefined;

    // Если загружен файл, сохраняем его
    if (profileImageFile) {
      const arrayBuffer = await profileImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const newFileName = `${Date.now()}-${profileImageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, newFileName);

      // Убедимся, что папка существует
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);

      profileImagePath = `/uploads/${newFileName}`;
    }

    const user = await prisma.user.update({
      where: { email },
      data: {
        fullName,
        phone,
        passportData,
        ...(profileImagePath && { profileImage: profileImagePath }),
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении профиля" },
      { status: 500 }
    );
  }
}
