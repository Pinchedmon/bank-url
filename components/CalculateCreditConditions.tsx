/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/CalculateCreditConditions.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CalculateCreditConditions({
  applicationId,
}: {
  applicationId: number;
}) {
  const [conditions, setConditions] = useState<any>(null);

  const handleCalculate = async () => {
    const res = await fetch("/api/calculate-conditions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId,
        amountRequested: 100000, // Можно передать из формы
        term: 12, // Можно передать из формы
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setConditions(data);
      toast("Условия рассчитаны");
    } else {
      toast("Ошибка");
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleCalculate}>Рассчитать условия</Button>
      {conditions && (
        <div>
          <p>Процентная ставка: {conditions.interestRate}%</p>
          <p>Ежемесячный платеж: {conditions.monthlyPayment.toFixed(2)}</p>
          <p>Срок: {conditions.term} месяцев</p>
        </div>
      )}
    </div>
  );
}
