"use client";

import { useState } from "react";
import Header from "@/components/Header";
import UserView from "@/components/user/UserView";
import AdminView from "@/components/admin/AdminView";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");

  return (
    <div className="min-h-screen bg-white">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab === "user" ? <UserView /> : <AdminView />}
      </main>
    </div>
  );
}
