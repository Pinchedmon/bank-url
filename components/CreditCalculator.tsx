// app/components/CreditCalculator.tsx
"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalculatorResult {
  monthlyPayment: number;
  totalPayment: number;
  interestRate: number;
}

interface CreditCalculatorProps {
  amount: string;
  term: string;
  onCalculate: (result: CalculatorResult | null) => void;
}

export default function CreditCalculator({
  amount,
  term,
  onCalculate,
}: CreditCalculatorProps) {
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const months = parseInt(term);
    const annualRate = 0.1; // 10% годовых, можно настроить
    const monthlyRate = annualRate / 12;

    if (!principal || !months || isNaN(principal) || isNaN(months)) {
      setResult(null);
      onCalculate(null);
      return;
    }

    // Формула аннуитетного платежа
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;

    const calcResult = {
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
      interestRate: annualRate * 100,
    };

    setResult(calcResult);
    onCalculate(calcResult);
  };

  useEffect(() => {
    if (amount && term) {
      calculateLoan();
    } else {
      setResult(null);
      onCalculate(null);
    }
  }, [amount, term]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Примерный расчет кредита</CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-2">
            <p>Ежемесячный платеж: {result.monthlyPayment} руб.</p>
            <p>Общая сумма выплат: {result.totalPayment} руб.</p>
            <p>Процентная ставка: {result.interestRate}% годовых</p>
          </div>
        ) : (
          <p>Введите сумму и срок для расчета</p>
        )}
      </CardContent>
    </Card>
  );
}
