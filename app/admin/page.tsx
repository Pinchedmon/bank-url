"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#e6ebfa] to-[#ffffff]">
      <h1 className="text-3xl font-extrabold text-center text-[#354fae] mb-8">
        Панель администратора
      </h1>
      <nav className="flex justify-center space-x-6">
        <Link
          href="/admin/users"
          className="text-[#354fae] hover:underline text-lg"
        >
          Пользователи
        </Link>
        <Link
          href="/admin/bookings"
          className="text-[#354fae] hover:underline text-lg"
        >
          Бронирования
        </Link>
        <Link
          href="/admin/flights"
          className="text-[#354fae] hover:underline text-lg"
        >
          Рейсы
        </Link>
      </nav>
    </div>
  );
}
