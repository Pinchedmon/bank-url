/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes, FaPlus } from "react-icons/fa";

interface Flight {
  flightId: number;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  economySeats: number;
  vipSeats: number;
  economyPrice: number;
  vipPrice: number;
  status: string;
}

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFlight, setEditFlight] = useState<Flight | null>(null);
  const [newFlight, setNewFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFlights = async () => {
      const res = await fetch("/api/admin/flights");
      const data = await res.json();
      setFlights(data);
      setLoading(false);
    };
    fetchFlights();
  }, []);

  const handleDelete = async (flightId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот рейс?")) return;
    try {
      const res = await fetch(`/api/admin/flights?flightId=${flightId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setFlights(flights.filter((flight) => flight.flightId !== flightId));
        setError("");
      } else {
        setError(data.error || "Ошибка при удалении");
      }
    } catch (error) {
      setError("Ошибка сервера");
    }
  };

  const handleEdit = (flight: Flight) => {
    setEditFlight(flight);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFlight) return;

    try {
      const res = await fetch("/api/admin/flights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFlight),
      });
      const data = await res.json();
      if (res.ok) {
        setFlights(
          flights.map((f) => (f.flightId === data.flightId ? data : f))
        );
        setEditFlight(null);
        setError("");
      } else {
        setError(data.error || "Ошибка при сохранении");
      }
    } catch (error) {
      setError("Ошибка сервера");
    }
  };

  const handleCreate = () => {
    setNewFlight({
      flightId: 0, // Это будет проигнорировано сервером
      flightNumber: "",
      departureCity: "",
      arrivalCity: "",
      departureTime: new Date().toISOString().slice(0, -8),
      arrivalTime: new Date().toISOString().slice(0, -8),
      economySeats: 0,
      vipSeats: 0,
      economyPrice: 0,
      vipPrice: 0,
      status: "SCHEDULED",
    });
  };

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlight) return;

    try {
      const res = await fetch("/api/admin/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFlight),
      });
      const data = await res.json();
      if (res.ok) {
        setFlights([...flights, data]);
        setNewFlight(null);
        setError("");
      } else {
        setError(data.error || "Ошибка при создании");
      }
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
      <h2 className="text-3xl font-extrabold mb-6 text-[#354fae]">Рейсы</h2>
      {error && (
        <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">
          {error}
        </p>
      )}
      <button
        onClick={handleCreate}
        className="mb-4 px-4 py-2 bg-[#354fae] text-white rounded-lg hover:bg-[#6f96d1] transition-all shadow-md flex items-center gap-2"
      >
        <FaPlus /> Создать рейс
      </button>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-[#354fae] text-white">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Номер</th>
            <th className="py-3 px-4">Откуда</th>
            <th className="py-3 px-4">Куда</th>
            <th className="py-3 px-4">Вылет</th>
            <th className="py-3 px-4">Прилёт</th>
            <th className="py-3 px-4">Эконом места</th>
            <th className="py-3 px-4">VIP места</th>
            <th className="py-3 px-4">Статус</th>
            <th className="py-3 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr
              key={flight.flightId}
              className="hover:bg-[#f0f4ff] transition-all"
            >
              <td className="border px-4 py-2">{flight.flightId}</td>
              <td className="border px-4 py-2">{flight.flightNumber}</td>
              <td className="border px-4 py-2">{flight.departureCity}</td>
              <td className="border px-4 py-2">{flight.arrivalCity}</td>
              <td className="border px-4 py-2">
                {new Date(flight.departureTime).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                {new Date(flight.arrivalTime).toLocaleString()}
              </td>
              <td className="border px-4 py-2">{flight.economySeats}</td>
              <td className="border px-4 py-2">{flight.vipSeats}</td>
              <td className="border px-4 py-2">{flight.status}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(flight)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(flight.flightId)}
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
        onClick={() => window.open("/api/admin/flights/export", "_blank")}
        className="mt-6 px-4 py-2 bg-[#354fae] text-white rounded-lg hover:bg-[#6f96d1] transition-all shadow-md"
      >
        Скачать отчет
      </button>

      {/* Модальное окно для редактирования */}
      {editFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#354fae]">
                Редактировать рейс
              </h3>
              <button
                onClick={() => setEditFlight(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[#354fae]">Номер рейса</label>
                <input
                  type="text"
                  value={editFlight.flightNumber}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      flightNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Город вылета</label>
                <input
                  type="text"
                  value={editFlight.departureCity}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      departureCity: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Город прилёта</label>
                <input
                  type="text"
                  value={editFlight.arrivalCity}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      arrivalCity: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Время вылета</label>
                <input
                  type="datetime-local"
                  value={new Date(editFlight.departureTime)
                    .toISOString()
                    .slice(0, -8)}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      departureTime: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Время прилёта</label>
                <input
                  type="datetime-local"
                  value={new Date(editFlight.arrivalTime)
                    .toISOString()
                    .slice(0, -8)}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      arrivalTime: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Эконом места</label>
                <input
                  type="number"
                  value={editFlight.economySeats}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      economySeats: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">VIP места</label>
                <input
                  type="number"
                  value={editFlight.vipSeats}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      vipSeats: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Цена эконом</label>
                <input
                  type="number"
                  value={editFlight.economyPrice}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      economyPrice: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Цена VIP</label>
                <input
                  type="number"
                  value={editFlight.vipPrice}
                  onChange={(e) =>
                    setEditFlight({
                      ...editFlight,
                      vipPrice: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Статус</label>
                <select
                  value={editFlight.status}
                  onChange={(e) =>
                    setEditFlight({ ...editFlight, status: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                >
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="DEPARTED">DEPARTED</option>
                  <option value="DELAYED">DELAYED</option>
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

      {/* Модальное окно для создания */}
      {newFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#354fae]">Создать рейс</h3>
              <button
                onClick={() => setNewFlight(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveNew} className="space-y-4">
              <div>
                <label className="block text-[#354fae]">Номер рейса</label>
                <input
                  type="text"
                  value={newFlight.flightNumber}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, flightNumber: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Город вылета</label>
                <input
                  type="text"
                  value={newFlight.departureCity}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      departureCity: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Город прилёта</label>
                <input
                  type="text"
                  value={newFlight.arrivalCity}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, arrivalCity: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Время вылета</label>
                <input
                  type="datetime-local"
                  value={newFlight.departureTime}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      departureTime: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Время прилёта</label>
                <input
                  type="datetime-local"
                  value={newFlight.arrivalTime}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, arrivalTime: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Эконом места</label>
                <input
                  type="number"
                  value={newFlight.economySeats}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      economySeats: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">VIP места</label>
                <input
                  type="number"
                  value={newFlight.vipSeats}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      vipSeats: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Цена эконом</label>
                <input
                  type="number"
                  value={newFlight.economyPrice}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      economyPrice: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Цена VIP</label>
                <input
                  type="number"
                  value={newFlight.vipPrice}
                  onChange={(e) =>
                    setNewFlight({
                      ...newFlight,
                      vipPrice: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Статус</label>
                <select
                  value={newFlight.status}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, status: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                >
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="DEPARTED">DEPARTED</option>
                  <option value="DELAYED">DELAYED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-[#354fae] text-white rounded-md hover:bg-[#6f96d1] transition-all"
              >
                Создать
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
