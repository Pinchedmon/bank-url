/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

interface User {
  userId: number;
  email: string;
  fullName: string;
  phone?: string;
  passportData?: string;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.userId !== userId));
      } else {
        alert("Ошибка при удалении");
      }
    } catch (error) {
      alert("Ошибка сервера");
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(
          users.map((u) => (u.userId === updatedUser.userId ? updatedUser : u))
        );
        setEditUser(null);
      } else {
        alert("Ошибка при сохранении");
      }
    } catch (error) {
      alert("Ошибка сервера");
    }
  };

  if (loading)
    return (
      <div className="text-center text-[#354fae] animate-pulse">
        Загрузка...
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-[#354fae]">
        Пользователи
      </h2>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-[#354fae] text-white">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Имя</th>
            <th className="py-3 px-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId} className="hover:bg-[#f0f4ff] transition-all">
              <td className="border px-4 py-2">{user.userId}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {user.fullName || "Не указано"}
              </td>
              <td className="border px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(user.userId)}
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
        onClick={() => window.open("/api/admin/users/export", "_blank")}
        className="mt-6 px-4 py-2 bg-[#354fae] text-white rounded-lg hover:bg-[#6f96d1] transition-all shadow-md"
      >
        Скачать отчет
      </button>

      {/* Модальное окно для редактирования */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#354fae]">
                Редактировать пользователя
              </h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[#354fae]">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#354fae]">ФИО</label>
                <input
                  type="text"
                  value={editUser.fullName || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, fullName: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Телефон</label>
                <input
                  type="text"
                  value={editUser.phone || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                />
              </div>
              <div>
                <label className="block text-[#354fae]">
                  Паспортные данные
                </label>
                <input
                  type="text"
                  value={editUser.passportData || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, passportData: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                />
              </div>
              <div>
                <label className="block text-[#354fae]">Роль</label>
                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="w-full p-2 border border-[#6f96d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#354fae]"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MODERATOR">MODERATOR</option>
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
