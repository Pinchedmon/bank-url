"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaPassport,
} from "react-icons/fa";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    passportData: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isLogin }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          email: data.email,
          role: data.role,
        })
      );
      if (!isLogin) {
        setIsLogin(true);
      } else {
        router.push(isLogin ? "/" : "/login");
      }
    } else {
      setError(data.error || "Ошибка");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center text-[#354fae] mb-8">
          {isLogin ? "Вход" : "Регистрация"}
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-6 bg-red-100 p-2 rounded-lg animate-pulse">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-[#354fae]" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-[#354fae]" />
            <input
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
              required
            />
          </div>
          {!isLogin && (
            <>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-[#354fae]" />
                <input
                  type="text"
                  placeholder="ФИО"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
                  required
                />
              </div>
              <div className="relative">
                <FaPhone className="absolute top-3 left-3 text-[#354fae]" />
                <input
                  type="text"
                  placeholder="Телефон (необязательно)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
                />
              </div>
              <div className="relative">
                <FaPassport className="absolute top-3 left-3 text-[#354fae]" />
                <input
                  type="text"
                  placeholder="Паспортные данные"
                  value={form.passportData}
                  onChange={(e) =>
                    setForm({ ...form, passportData: e.target.value })
                  }
                  className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-[#354fae] text-white font-semibold rounded-lg hover:bg-[#6f96d1] transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-[#354fae] hover:text-[#6f96d1] hover:underline transition-all duration-200"
        >
          {isLogin
            ? "Нет аккаунта? Зарегистрируйтесь"
            : "Уже есть аккаунт? Войдите"}
        </button>
      </div>
    </div>
  );
}
