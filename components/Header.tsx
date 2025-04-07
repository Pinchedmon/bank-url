/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<{ userId: number; email: string } | null>(
    null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="flex justify-between items-center bg-[#ffffff] p-4 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-[#354fae]">
        <Link href="/">✈️ Полёт.ру</Link>
      </h1>
      <div className="space-x-6">
        {user ? (
          <>
            <Link
              href="/profile"
              className="text-[#354fae] hover:underline font-medium"
            >
              Мой аккаунт
            </Link>
            <Link
              href="/bookings"
              className="text-[#354fae] hover:underline font-medium"
            >
              Мои бронирования
            </Link>
            <button
              onClick={handleLogout}
              className="text-[#354fae] hover:underline font-medium"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-[#354fae] hover:underline font-medium"
            >
              Войти
            </Link>
            <Link
              href="/login"
              className="text-[#354fae] hover:underline font-medium"
            >
              Зарегистрироваться
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
