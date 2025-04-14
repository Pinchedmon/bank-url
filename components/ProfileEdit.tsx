// app/components/ProfileEdit.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Profile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

export default function ProfileEdit({ clientId }: { clientId: number }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch(`/api/profile?clientId=${clientId}`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [clientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, ...profile }),
    });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={profile.fullName}
        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
        placeholder="Full Name"
      />
      <Input
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        placeholder="Email"
      />
      <Input
        value={profile.phone}
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        placeholder="Phone"
      />
      <Button type="submit">Сохранить изменения</Button>
    </form>
  );
}
