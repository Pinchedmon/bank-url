/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/client/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import ProfileEdit from "@/components/ProfileEdit";
import CreditApplicationForm from "@/components/CreditApplicationForm";
import ApplicationTable from "@/components/ApplicationTable";

export default function ClientPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth");
    } else {
      setUser(JSON.parse(userData));
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  console.log(user);
  if (!user?.id) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
        Личный кабинет
      </h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="profile" className="rounded-md">
            Профиль
          </TabsTrigger>
          <TabsTrigger value="application" className="rounded-md">
            Подать заявку
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-md">
            Мои заявки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-lg transition-transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="text-xl">Ваш профиль</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <img
                src={`http://localhost:3000/${user.profileImage}`}
                alt={""}
                width={32}
                height={32}
              />

              <ProfileImageUpload clientId={user.id} />
              <ProfileEdit clientId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card className="shadow-lg transition-transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="text-xl">Новая заявка</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditApplicationForm clientId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card className="shadow-lg transition-transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="text-xl">Мои заявки</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationTable status="user" clientId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
