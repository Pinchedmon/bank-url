/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApplicationTable from "@/components/ApplicationTable";

export default function EmployeePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="container py-10">
      <div className="card">
        <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
          Панель сотрудника
        </h1>
        <ApplicationTable status={"employee"} />
      </div>
    </div>
  );
}
