/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Application {
  id: number;
  client: { id: number; fullName: string; email: string };
  applicationDate: string;
  status: string;
  amountRequested: number;
  term: number;
}

interface ApplicationTableProps {
  status: string;
  clientId?: number;
}

export default function ApplicationTable({
  status,
  clientId,
}: ApplicationTableProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("applicationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Application>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/applications", window.location.origin);

      // Всегда фильтруем по clientId, если он передан
      if (clientId) {
        url.searchParams.append("clientId", clientId.toString());
      }

      // Добавляем дополнительные параметры
      if (search) url.searchParams.append("search", search);
      if (statusFilter) url.searchParams.append("status", statusFilter);
      url.searchParams.append("sortBy", sortBy);
      url.searchParams.append("sortOrder", sortOrder);

      const res = await fetch(url.toString());
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      toast.error("Ошибка при загрузке заявок");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, statusFilter, sortBy, sortOrder, clientId]);

  const handleEdit = (app: Application) => {
    setEditingId(app.id);
    setEditForm({
      ...app,
      applicationDate: new Date(app.applicationDate)
        .toISOString()
        .split("T")[0],
    });
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountRequested: editForm.amountRequested,
          term: editForm.term,
          status: editForm.status,
        }),
      });

      if (response.ok) {
        toast.success("Изменения сохранены");
        setEditingId(null);
        await fetchApplications();
      } else {
        throw new Error("Ошибка при обновлении");
      }
    } catch (error) {
      toast.error("Ошибка при сохранении изменений");
    }
  };

  const isAdmin = status === "admin" || status === "employee";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />

        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
          className="p-2 border rounded"
        >
          <option value="">Все статусы</option>
          <option value="PENDING">В ожидании</option>
          <option value="APPROVED">Одобрено</option>
          <option value="REJECTED">Отклонено</option>
        </select>

        <Button
          onClick={() => {
            setSortBy("applicationDate");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }}
          variant="outline"
        >
          Сортировать по дате ({sortOrder === "asc" ? "↑" : "↓"})
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {clientId ? "У вас пока нет заявок" : "Заявки не найдены"}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {!clientId && <TableHead>Клиент</TableHead>}
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Срок</TableHead>
                {isAdmin && <TableHead>Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  {editingId === app.id ? (
                    <>
                      {!clientId && (
                        <TableCell>{app.client.fullName}</TableCell>
                      )}
                      <TableCell>
                        <Input
                          type="date"
                          value={editForm.applicationDate}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                          className="p-1 border rounded"
                        >
                          <option value="PENDING">В ожидании</option>
                          <option value="APPROVED">Одобрено</option>
                          <option value="REJECTED">Отклонено</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.amountRequested || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              amountRequested: parseFloat(e.target.value),
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm.term || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              term: parseInt(e.target.value),
                            })
                          }
                        />
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="flex gap-2">
                          <Button onClick={() => handleSave(app.id)} size="sm">
                            Сохранить
                          </Button>
                          <Button
                            onClick={() => setEditingId(null)}
                            variant="outline"
                            size="sm"
                          >
                            Отмена
                          </Button>
                        </TableCell>
                      )}
                    </>
                  ) : (
                    <>
                      {!clientId && (
                        <TableCell>{app.client.fullName}</TableCell>
                      )}
                      <TableCell>
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{app.status}</TableCell>
                      <TableCell>
                        {app.amountRequested.toLocaleString()} ₽
                      </TableCell>
                      <TableCell>{app.term} мес.</TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Button
                            onClick={() => handleEdit(app)}
                            size="sm"
                            variant="outline"
                          >
                            Редактировать
                          </Button>
                        </TableCell>
                      )}
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
