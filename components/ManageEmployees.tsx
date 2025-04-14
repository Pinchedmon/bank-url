/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/ManageEmployees.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  };

  const fetchRoles = async () => {
    const res = await fetch("/api/roles");
    const data = await res.json();
    setRoles(data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const handleAddEmployee = async () => {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, roleId: parseInt(roleId) }),
    });
    if (res.ok) {
      fetchEmployees();
      setFullName("");
      setEmail("");
      setRoleId("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Управление сотрудниками</h2>
      <div className="flex space-x-4">
        <Input
          placeholder="Имя сотрудника"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select onValueChange={setRoleId} value={roleId}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите роль" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddEmployee}>Добавить сотрудника</Button>
      </div>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.fullName} ({emp.email}) - {emp.role.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
