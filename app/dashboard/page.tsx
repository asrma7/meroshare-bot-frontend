"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
