"use client";
import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const handleLogout = () => {
    clearUser();
    router.push("/explore");
  };

  const { clearUser } = useAuthStore();
  const { user } = useAuthStore();
  return (
    <div className="w-full h-[calc(100vh-90px)] p-4 font-inter bg-blue-light">
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default page;
