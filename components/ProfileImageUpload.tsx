"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfileImageUpload({ clientId }: { clientId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Пожалуйста, выберите изображение");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("clientId", clientId.toString());

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      // Обновляем localStorage
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        const updatedUser = {
          ...user,
          profileImage: data.imageUrl,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Изображение профиля успешно обновлено");

      // Обновляем страницу для применения изменений
      window.location.reload();
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      toast.error("Ошибка при загрузке изображения");
    } finally {
      setIsUploading(false);
    }
  };

  // Получаем текущее изображение из localStorage
  const currentImage =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}").profileImage
      : null;

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="flex flex-col items-center">
          <img
            src={currentImage}
            alt="Текущее изображение профиля"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <p className="text-sm text-gray-500">Текущее изображение</p>
        </div>
      )}

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={isUploading}
      />
      <Button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Загрузка..." : "Загрузить изображение"}
      </Button>
    </div>
  );
}
