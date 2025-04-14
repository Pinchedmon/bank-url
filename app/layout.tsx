import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "АИС Кредитования Банком",
  description: "Система управления кредитованием",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="container mx-auto">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
