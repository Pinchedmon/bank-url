"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  interface User {
    role: "CLIENT" | "EMPLOYEE" | "ADMIN";
  }

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This code runs only on the client side
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    setUser(userData);
    setIsLoading(false);

    if (!userData) {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/auth");
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user) {
    return null; // The useEffect will redirect to /auth
  }

  return (
    <div>
      {user && (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <h1 className="text-4xl font-bold">АИС Кредитования Банком</h1>
          <div className="space-x-4">
            {user.role === "CLIENT" && (
              <Link href="/client">
                <Button>Кабинет клиента</Button>
              </Link>
            )}
            {["EMPLOYEE", "ADMIN"].includes(user.role) && (
              <Link href="/employee">
                <Button>Кабинет сотрудника</Button>
              </Link>
            )}
            {user.role === "ADMIN" && (
              <Link href="/admin">
                <Button>Панель администратора</Button>
              </Link>
            )}
            <Button onClick={handleLogout} variant="destructive">
              Выйти
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
