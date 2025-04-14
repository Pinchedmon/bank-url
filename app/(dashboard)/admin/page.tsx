"use client";
import ApplicationTable from "@/components/ApplicationTable";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const handleExport = async () => {
    const res = await fetch("/api/export-excel");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.xlsx";
    a.click();
  };

  return (
    <div className="container py-10">
      <div className="card">
        <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
          Панель администратора
        </h1>
        <Button onClick={handleExport} className="btn mb-6">
          Экспорт в Excel
        </Button>
        <ApplicationTable status={"admin"} />
      </div>
    </div>
  );
}
