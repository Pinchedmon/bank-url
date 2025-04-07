"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { FaUser, FaPhone, FaPassport, FaCamera } from "react-icons/fa";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    email: "",
    fullName: "",
    phone: "",
    passportData: "",
    profileImage: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const res = await fetch(`/api/profile?email=${user.email}`);
        const data = await res.json();
        setProfile({
          email: data.email || user.email,
          fullName: data.fullName || "",
          phone: data.phone || "",
          passportData: data.passportData || "",
          profileImage: data.profileImage || "",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("email", profile.email);
    formData.append("fullName", profile.fullName);
    formData.append("phone", profile.phone);
    formData.append("passportData", profile.passportData);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    const res = await fetch("/api/profile", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const updatedProfile = await res.json();
      setProfile((prev) => ({
        ...prev,
        profileImage: updatedProfile.profileImage,
      }));
      setSuccess("Профиль успешно обновлен!");
      setSelectedFile(null);
      setPreview(null);
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка при обновлении профиля");
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <Header />
      <div className="mt-12 max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
        <h2 className="text-3xl font-extrabold text-center text-[#354fae] mb-6">
          Ваш профиль
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg animate-pulse">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-center mb-4 bg-green-100 p-2 rounded-lg animate-bounce">
            {success}
          </p>
        )}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {profile.profileImage && !preview ? (
              <Image
                src={profile.profileImage}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-[#354fae] shadow-md"
              />
            ) : preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-[#6f96d1] shadow-md"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-dashed border-[#6f96d1]">
                <FaUser size={40} />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-[#354fae] p-2 rounded-full text-white cursor-pointer hover:bg-[#6f96d1] transition">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-[#354fae]" />
            <input
              type="email"
              placeholder="Email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] disabled:opacity-50"
              disabled
            />
          </div>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-[#354fae]" />
            <input
              type="text"
              placeholder="ФИО"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
            />
          </div>
          <div className="relative">
            <FaPhone className="absolute top-3 left-3 text-[#354fae]" />
            <input
              type="text"
              placeholder="Телефон"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
            />
          </div>
          <div className="relative">
            <FaPassport className="absolute top-3 left-3 text-[#354fae]" />
            <input
              type="text"
              placeholder="Паспортные данные"
              value={profile.passportData}
              onChange={(e) =>
                setProfile({ ...profile, passportData: e.target.value })
              }
              className="w-full pl-10 p-3 bg-[#f0f4ff] text-[#354fae] rounded-lg border border-[#6f96d1] focus:outline-none focus:ring-2 focus:ring-[#354fae] transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-[#354fae] text-white font-semibold rounded-lg hover:bg-[#6f96d1] transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  );
}
