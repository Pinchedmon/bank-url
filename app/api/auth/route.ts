/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, phone, address, isLogin, role } =
      await req.json();

    if (isLogin) {
      // Проверяем, есть ли пользователь в Client
      let user = await prisma.client.findUnique({
        where: { email },
        include: { role: true },
      });
      let userType = "client";

      // Если не нашли в Client, ищем в Employee
      if (!user) {
        user = (await prisma.employee.findUnique({
          where: { email },
          include: { role: true },
        })) as any;
        userType = "employee";
      }

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return NextResponse.json({ error: "Неверные данные" }, { status: 401 });
      }

      return NextResponse.json(
        {
          id: user.id,
          email: user.email,
          role: user.role.name,
          userType,
          profileImage: user.profileImage,
        },
        { status: 200 }
      );
    } else {
      // Регистрация нового пользователя
      const existingClient = await prisma.client.findUnique({
        where: { email },
      });
      const existingEmployee = await prisma.employee.findUnique({
        where: { email },
      });

      if (existingClient || existingEmployee) {
        return NextResponse.json({ error: "Email уже занят" }, { status: 400 });
      }

      const existingPhoneClient = phone
        ? await prisma.client.findFirst({ where: { phone } })
        : null;
      const existingPhoneEmployee = phone
        ? await prisma.employee.findFirst({ where: { phone } })
        : null;

      if (existingPhoneClient || existingPhoneEmployee) {
        return NextResponse.json(
          { error: "Телефон уже зарегистрирован" },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      let user;

      if (role === "CLIENT") {
        user = await prisma.client.create({
          data: {
            email,
            passwordHash,
            fullName,

            phone: phone || null,
            address: address || "",
            role: { connect: { name: "CLIENT" } },
          },
          include: { role: true },
        });
      } else {
        // Предполагаем, что регистрация сотрудника доступна только админу, но для теста добавим
        user = await prisma.employee.create({
          data: {
            email,
            passwordHash,
            fullName,
            phone: phone || "", // Ensure phone is provided, even if it's an empty string
            role: { connect: { name: role || "EMPLOYEE" } },
          },
          include: { role: true },
        });
      }

      return NextResponse.json(
        {
          id: user.id,
          email: user.email,
          role: user.role.name,

          userType: role === "CLIENT" ? "client" : "employee",
        },
        { status: 201 }
      );
    }
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
