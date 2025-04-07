import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Система бронирования",
  description: "Бронирование авиабилетов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="container mx-auto bg-[#D1E5FF] text-[#354fae]">
        {children}
      </body>
    </html>
  );
}
