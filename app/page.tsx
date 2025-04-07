/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [flights, setFlights] = useState<any[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<any[]>([]);
  const [user, setUser] = useState<{ userId: number; email: string } | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("departureTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dateFormat, setDateFormat] = useState("short");
  const [booking, setBooking] = useState<{
    flightId: number;
    class: "ECONOMY" | "VIP";
    seatCount: number;
  }>({
    flightId: 0,
    class: "ECONOMY",
    seatCount: 1,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchFlights = async () => {
      const res = await fetch("/api/flights");
      const data = await res.json();
      setFlights(data);
      setFilteredFlights(data);
    };
    fetchFlights();
  }, []);

  // Поиск и фильтрация
  useEffect(() => {
    let result = [...flights];

    // Поиск по городам
    if (search) {
      result = result.filter(
        (f) =>
          f.departureCity.toLowerCase().includes(search.toLowerCase()) ||
          f.arrivalCity.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (statusFilter !== "ALL") {
      result = result.filter((f) => f.status === statusFilter);
    }

    // Сортировка
    result.sort((a, b) => {
      if (sortBy === "departureTime") {
        return sortOrder === "asc"
          ? new Date(a.departureTime).getTime() -
              new Date(b.departureTime).getTime()
          : new Date(b.departureTime).getTime() -
              new Date(a.departureTime).getTime();
      } else if (sortBy === "economyPrice") {
        return sortOrder === "asc"
          ? a.economyPrice - b.economyPrice
          : b.economyPrice - a.economyPrice;
      }
      return 0;
    });

    setFilteredFlights(result);
  }, [search, statusFilter, sortBy, sortOrder, flights]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleBooking = async (flightId: number) => {
    if (!user) {
      setError("Пожалуйста, войдите, чтобы забронировать рейс");
      return;
    }

    setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.userId,
        flightId,
        class: booking.class,
        seatCount: booking.seatCount,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      alert(`Рейс ${flightId} успешно забронирован!`);
      // Обновляем список рейсов после бронирования
      const updatedFlights = flights.map((f) =>
        f.flightId === flightId
          ? {
              ...f,
              economySeats:
                booking.class === "ECONOMY"
                  ? f.economySeats - booking.seatCount
                  : f.economySeats,
              vipSeats:
                booking.class === "VIP"
                  ? f.vipSeats - booking.seatCount
                  : f.vipSeats,
            }
          : f
      );
      setFlights(updatedFlights);
      setFilteredFlights(updatedFlights);
    } else {
      setError(data.error || "Ошибка при бронировании");
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return dateFormat === "short"
      ? d.toLocaleString("ru", { dateStyle: "short", timeStyle: "short" })
      : d.toLocaleString("ru", { dateStyle: "long", timeStyle: "medium" });
  };

  return (
    <div className="min-h-screen p-6 ">
      <header className="flex justify-between items-center bg-[#ffffff] p-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-[#354fae]">✈️ Полёт.ру</h1>
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

      <div className="mt-8 bg-[#ffffff] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#354fae] mb-6">
          Доступные рейсы
        </h2>

        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по городам"
            className="flex-grow p-3 bg-[#6f96d1] text-white placeholder-[#ffffff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 bg-[#6f96d1] text-white rounded-md"
          >
            <option value="ALL">Все статусы</option>
            <option value="SCHEDULED">Запланирован</option>
            <option value="DEPARTED">Вылетел</option>
            <option value="DELAYED">Задержан</option>
            <option value="CANCELLED">Отменен</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-3 bg-[#6f96d1] text-white rounded-md"
          >
            <option value="departureTime">По дате вылета</option>
            <option value="economyPrice">По цене (эконом)</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-3 bg-[#354fae] text-[#ffffff] rounded-md hover:bg-opacity-90 transition"
          >
            {sortOrder === "asc" ? "↑ Возр." : "↓ Убыв."}
          </button>
        </div>

        {/* Настройки */}
        <div className="flex gap-4 mb-6">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 bg-[#6f96d1] text-white rounded-md"
          >
            <option value={5}>5 рейсов</option>
            <option value={10}>10 рейсов</option>
            <option value={20}>20 рейсов</option>
          </select>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="p-2 bg-[#6f96d1] text-white rounded-md"
          >
            <option value="short">Короткий формат</option>
            <option value="long">Полный формат</option>
          </select>
        </div>

        {/* Список рейсов */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {filteredFlights.length === 0 ? (
          <p className="text-center text-[#354fae]">Рейсы не найдены</p>
        ) : (
          <div className="grid gap-6">
            {filteredFlights.slice(0, itemsPerPage).map((flight) => (
              <div
                key={flight.flightId}
                className="bg-white p-6 rounded-lg shadow-md border border-[#354fae]/20 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-[#354fae]">
                      {flight.flightNumber}: {flight.departureCity} →{" "}
                      {flight.arrivalCity}
                    </h3>
                    <p className="text-[#354fae] mt-1">
                      Вылет: {formatDate(flight.departureTime)}
                    </p>
                    <p className="text-[#354fae]">
                      Прилет: {formatDate(flight.arrivalTime)}
                    </p>
                    <p className="text-[#354fae] mt-2">
                      Эконом: {flight.economyPrice} ₽ ({flight.economySeats}{" "}
                      мест)
                    </p>
                    <p className="text-[#354fae]">
                      VIP: {flight.vipPrice} ₽ ({flight.vipSeats} мест)
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      flight.status === "SCHEDULED"
                        ? "bg-green-200 text-green-800"
                        : flight.status === "DEPARTED"
                        ? "bg-blue-200 text-blue-800"
                        : flight.status === "DELAYED"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {flight.status === "SCHEDULED"
                      ? "Запланирован"
                      : flight.status === "DEPARTED"
                      ? "Вылетел"
                      : flight.status === "DELAYED"
                      ? "Задержан"
                      : "Отменен"}
                  </span>
                </div>

                {flight.status === "SCHEDULED" && (
                  <div className="mt-4 flex gap-4 items-center">
                    <select
                      value={booking.class}
                      onChange={(e) =>
                        setBooking({
                          ...booking,
                          class: e.target.value as "ECONOMY" | "VIP",
                        })
                      }
                      className="p-2 bg-[#6f96d1] text-white rounded-md"
                    >
                      <option value="ECONOMY">Эконом</option>
                      <option value="VIP">VIP</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      max={
                        booking.class === "ECONOMY"
                          ? flight.economySeats
                          : flight.vipSeats
                      }
                      value={booking.seatCount}
                      onChange={(e) =>
                        setBooking({
                          ...booking,
                          seatCount: Number(e.target.value),
                        })
                      }
                      className="w-20 p-2 bg-[#6f96d1] text-white rounded-md"
                    />
                    <button
                      onClick={() => handleBooking(flight.flightId)}
                      className="px-4 py-2 bg-[#354fae] text-[#ffffff] rounded-md hover:bg-opacity-90 transition"
                    >
                      Забронировать
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
