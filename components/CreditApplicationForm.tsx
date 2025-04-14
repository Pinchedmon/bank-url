"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreditCalculator from "@/components/CreditCalculator";
import { toast } from "sonner";

interface CalculatorResult {
  monthlyPayment: number;
  totalPayment: number;
  interestRate: number;
}

export default function CreditApplicationForm({
  clientId,
}: {
  clientId: number;
}) {
  const [form, setForm] = useState({
    amountRequested: "",
    term: "",
    deviceId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Добавлено состояние загрузки
  const [calculation, setCalculation] = useState<CalculatorResult | null>(null);

  const validateInputs = () => {
    const amount = parseFloat(form.amountRequested);
    const term = parseFloat(form.term);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Сумма кредита должна быть положительным числом");
      return false;
    }

    if (isNaN(term) || term <= 0 || !Number.isInteger(term)) {
      toast.error("Срок должен быть целым положительным числом");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateInputs()) {
      setIsSubmitting(false);
      return;
    }

    if (!calculation) {
      toast.warning("Пожалуйста, выполните расчет перед отправкой");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          amountRequested: parseFloat(form.amountRequested),
          term: parseInt(form.term),
          deviceId: form.deviceId || null, // Убедитесь, что deviceId либо строка, либо null
        }),
      });

      const data = await res.json(); // Добавлено чтение ответа

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при отправке заявки");
      }

      toast.success("Заявка успешно отправлена");
      setForm({ amountRequested: "", term: "", deviceId: "" });
      setCalculation(null);
    } catch (error) {
      console.error("Ошибка:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Ошибка при отправке заявки");
      } else {
        toast.error("Ошибка при отправке заявки");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          placeholder="Сумма кредита (руб.)"
          value={form.amountRequested}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value >= 0 || e.target.value === "") {
              setForm({ ...form, amountRequested: e.target.value });
            }
          }}
          min="10000"
          step="1000"
          required
        />
        <Input
          type="number"
          placeholder="Срок (месяцев)"
          value={form.term}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if ((value >= 0 && value <= 120) || e.target.value === "") {
              setForm({ ...form, term: e.target.value });
            }
          }}
          min="1"
          max="120"
          required
        />
        <CreditCalculator
          amount={form.amountRequested}
          term={form.term}
          onCalculate={(result) => setCalculation(result)}
        />
        <Button type="submit" disabled={!calculation || isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить заявку"}
        </Button>
      </form>
    </div>
  );
}
