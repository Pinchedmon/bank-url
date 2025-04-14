/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/calculate-conditions/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { applicationId, amountRequested, term } = await request.json();

    // Простая логика расчета: процентная ставка фиксированная (например, 10%)
    const interestRate = 10;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amountRequested * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

    const condition = await prisma.creditCondition.create({
      data: {
        applicationId,
        interestRate,
        term,
        monthlyPayment,
      },
    });

    // Обновим заявку с рассчитанным ежемесячным платежом
    await prisma.application.update({
      where: { id: applicationId },
      data: { monthlyPayment },
    });

    return NextResponse.json(condition);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate conditions" },
      { status: 500 }
    );
  }
}
