import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, phone, passportData, isLogin } =
      await req.json();

    if (isLogin) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return NextResponse.json({ error: "Неверные данные" }, { status: 401 });
      }
      return NextResponse.json(
        { userId: user.userId, email: user.email, role: user.role },
        { status: 200 }
      );
    } else {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "Email уже занят" }, { status: 400 });
      }

      const existingPhone = phone
        ? await prisma.user.findUnique({ where: { phone } })
        : null;
      if (existingPhone) {
        return NextResponse.json(
          { error: "Телефон уже зарегистрирован" },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          phone: phone || null, // Если телефон пустой, записываем null
          passportData,
        },
      });
      return NextResponse.json(
        { userId: user.userId, email: user.email, role: user.role },
        { status: 201 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email или телефон уже занят" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
