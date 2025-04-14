"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    role: "CLIENT",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isLogin }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          email: data.email,
          role: data.role,
          userType: data.userType,
          profileImage: data.profileImage,
        })
      );
      toast(isLogin ? "Вход успешен" : "Регистрация успешна");

      if (!isLogin) {
        setIsLogin(true);
      } else {
        if (data.role === "CLIENT") {
          router.push("/client");
        } else if (data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/employee");
        }
      }
    } else {
      setError(data.error || "Ошибка");
      toast("Ошибка");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <div className="form-container w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
          {isLogin ? "Вход" : "Регистрация"}
        </h2>
        {error && (
          <p className="text-[var(--destructive)] text-center mb-6 bg-[var(--destructive)]/10 p-3 rounded-[var(--radius)]">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              required
            />
          </div>
          <div className="relative">
            <Input
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
              required
            />
          </div>
          {!isLogin && (
            <>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ФИО"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Телефон (необязательно)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input"
                />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Адрес"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="input"
                  required
                />
              </div>
            </>
          )}
          <Button type="submit" className="btn w-full">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>
        <Button
          variant="link"
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-[var(--primary)] hover:text-[var(--primary)]/80"
        >
          {isLogin
            ? "Нет аккаунта? Зарегистрируйтесь"
            : "Уже есть аккаунт? Войдите"}
        </Button>
      </div>
    </div>
  );
}
