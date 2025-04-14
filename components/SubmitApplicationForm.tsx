/* eslint-disable @typescript-eslint/no-unused-vars */
// app/components/SubmitApplicationForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SubmitApplicationForm({
  clientId,
}: {
  clientId: number;
}) {
  const [amountRequested, setAmountRequested] = useState("");
  const [term, setTerm] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          amountRequested: parseFloat(amountRequested),
          term: parseInt(term),
        }),
      });
      if (res.ok) {
        toast("Заявка подана");
        setAmountRequested("");
        setTerm("");
      } else {
        toast("Ошибка");
      }
    } catch (error) {
      toast("Ошибка");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Подать заявку на кредит</h2>
      <Input
        type="number"
        placeholder="Сумма кредита"
        value={amountRequested}
        onChange={(e) => setAmountRequested(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Срок (в месяцах)"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <Button onClick={handleSubmit}>Подать заявку</Button>
    </div>
  );
}
