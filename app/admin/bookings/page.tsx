"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

interface Booking {
  bookingId: number;
  userId: number;
  flightId: number;
  class: string;
  seatCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  cancelledAt?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId: number) => {
    if (!confirm("Вы уверены, что хотите удалить это бронирование?")) return;
    try {
      const res = await fetch(`/api/admin/bookings?bookingId=${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(
          bookings.filter((booking) => booking.bookingId !== bookingId)
        );
        setError("");
      } else {
        setError(data.error || "Ошибка при удалении");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Ошибка сервера");
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditBooking(booking);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBooking) return;

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBooking),
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(
          bookings.map((b) => (b.bookingId === data.bookingId ? data : b))
        );
        setEditBooking(null);
        setError("");
      } else {
        setError(data.error || "Ошибка при сохранении");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Ошибка сервера");
    }
  };

  if (loading)
    return (
      <div className="text-center text-[#354fae] animate-pulse">
        Загрузка...
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-[#e6ebfa] to-[#ffffff] min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-[#354fae]">
        Бронирования
      </h2>
      {error && (
        <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
          {error}
        </p>
      )}
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-[#354fae] text-white">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">User ID</th>
            <th className="py-3 px-4">Flight ID</th>
            <th className="py-3 px-4">Класс</th>
            <th className="py-3 px-4">Места</th>
            <th className="py-3 px-4">Стоимость</th>
            <th className="py-3 px-4">Статус</th>
            <th className="py-3 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.bookingId}
              className="hover:bg-[#f0f4ff] transition-all"
            >
              <td className="border px-4 py-2">{booking.bookingId}</td>
              <td className="border px-4 py-2">{booking.userId}</td>
              <td className="border px-4 py-2">{booking.flightId}</td>
              <td className="border px-4 py-2">{booking.class}</td>
              <td className="border px-4 py-2">{booking.seatCount}</td>
              <td className="border px-4 py-2">{booking.totalPrice} ₽</td>
              <td className="border px-4 py-2">{booking.status}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(booking)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(booking.bookingId)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => window.open("/api/admin/bookings/export", "_blank")}
        className="mt-6 px-4 py-2 bg-[#354fae] text-white rounded-lg hover:bg-[#6f96d1] transition-all shadow-md"
      >
        Скачать отчет
      </button>

      {/* Модальное окно для редактирования */}
      {editBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#354fae]">
                Редактировать бронирование
              </h3>
              <button
                onClick={() => setEditBooking(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[#354fae]">User ID</label>
                <input
                  type="number"
                  value={editBooking.userId}
                  onChange={(e) =>
                    setEditBooking({
                      ...editBooking,
                      userId: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Flight ID</label>
                <input
                  type="number"
                  value={editBooking.flightId}
                  onChange={(e) =>
                    setEditBooking({
                      ...editBooking,
                      flightId: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Класс</label>
                <select
                  value={editBooking.class}
                  onChange={(e) =>
                    setEditBooking({ ...editBooking, class: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                >
                  <option value="ECONOMY">ECONOMY</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-[#354fae]">Места</label>
                <input
                  type="number"
                  value={editBooking.seatCount}
                  onChange={(e) =>
                    setEditBooking({
                      ...editBooking,
                      seatCount: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Стоимость</label>
                <input
                  type="number"
                  value={editBooking.totalPrice}
                  onChange={(e) =>
                    setEditBooking({
                      ...editBooking,
                      totalPrice: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Статус</label>
                <select
                  value={editBooking.status}
                  onChange={(e) =>
                    setEditBooking({ ...editBooking, status: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-[#354fae] text-white rounded-md hover:bg-[#6f96d1] transition-all"
              >
                Сохранить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
