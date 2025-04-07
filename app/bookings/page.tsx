/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  FaPlane,
  FaChair,
  FaMoneyBillWave,
  FaTimesCircle,
  FaSpinner,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
} from "react-icons/fa";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<{ userId: number; email: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings?userId=${user.userId}`);
        if (!res.ok) throw new Error("Ошибка при загрузке бронирований");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId: number) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "CANCELLED" }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Ошибка при отмене бронирования");
      }
      const data = await res.json();
      setBookings(bookings.map((b) => (b.bookingId === bookingId ? data : b)));
      setError(""); // Очищаем ошибку при успехе
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Форматирование времени
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <Header />
      <div className="mt-12 max-w-5xl mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all hover:scale-[1.02] duration-300">
        <h2 className="text-3xl font-extrabold text-center text-[#354fae] mb-8 flex items-center justify-center gap-2">
          <FaPlane /> Мои бронирования
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-100 p-4 rounded-lg">
            {error}
          </p>
        )}

        {loading ? (
          <div className="text-center text-[#354fae] flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin" /> Загрузка...
          </div>
        ) : !user ? (
          <p className="text-center text-[#354fae] bg-[#f0f4ff] p-4 rounded-lg">
            Пожалуйста, войдите в систему, чтобы увидеть ваши бронирования
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-[#354fae] bg-[#f0f4ff] p-4 rounded-lg">
            У вас пока нет бронирований
          </p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="p-6 bg-[#f0f4ff] rounded-lg shadow-md border border-[#354fae]/10 hover:shadow-lg transition-all duration-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaPlane className="text-[#6f96d1]" />
                      <strong>Номер рейса:</strong>{" "}
                      {booking.flight?.flightNumber || "Неизвестно"}
                    </p>
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#6f96d1]" />
                      <strong>Откуда:</strong>{" "}
                      {booking.flight?.departureCity || "Неизвестно"}
                    </p>
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#6f96d1]" />
                      <strong>Куда:</strong>{" "}
                      {booking.flight?.arrivalCity || "Неизвестно"}
                    </p>
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaPlaneDeparture className="text-[#6f96d1]" />
                      <strong>Вылет:</strong>{" "}
                      {booking.flight?.departureTime
                        ? `${formatDate(
                            booking.flight.departureTime
                          )} в ${formatTime(booking.flight.departureTime)}`
                        : "Неизвестно"}
                    </p>
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaPlaneArrival className="text-[#6f96d1]" />
                      <strong>Прилёт:</strong>{" "}
                      {booking.flight?.arrivalTime
                        ? `${formatDate(
                            booking.flight.arrivalTime
                          )} в ${formatTime(booking.flight.arrivalTime)}`
                        : "Неизвестно"}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaChair className="text-[#6f96d1]" />
                      <strong>Класс:</strong> {booking.class || "Неизвестно"}
                    </p>
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaChair className="text-[#6f96d1]" />
                      <strong>Мест:</strong> {booking.seatCount || "0"}
                    </p>
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#6f96d1]" />
                      <strong>Стоимость:</strong> {booking.totalPrice || "0"} ₽
                    </p>
                    <p className="text-[#354fae] flex items-center gap-2">
                      <FaCalendarAlt className="text-[#6f96d1]" />
                      <strong>Дата бронирования:</strong>{" "}
                      {formatDate(booking.createdAt)}
                    </p>
                    <p
                      className={`flex items-center gap-2 ${
                        booking.status === "ACTIVE"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <FaTimesCircle className="text-[#6f96d1]" />
                      <strong>Статус:</strong> {booking.status}
                    </p>
                    {booking.cancelledAt && (
                      <p className="text-[#354fae] flex items-center gap-2">
                        <FaTimesCircle className="text-[#6f96d1]" />
                        <strong>Дата отмены:</strong>{" "}
                        {formatDate(booking.cancelledAt)}
                      </p>
                    )}
                    {booking.status === "ACTIVE" && (
                      <button
                        onClick={() => handleCancel(booking.bookingId)}
                        className="mt-4 px-4 py-2 bg-[#354fae] text-white rounded-lg hover:bg-[#6f96d1] transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
                      >
                        <FaTimesCircle /> Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
