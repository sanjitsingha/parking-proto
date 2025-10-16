"use client";
import React, { useEffect } from "react";
import LoginUser from "../_components/LoginUser";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

const page = () => {
  const url = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && url === "/login") {
      router.replace("/account");
    }
  }, [url, router, user]);

  return (
    <div className="w-full h-[calc(100vh-90px)] bg-blue-light">
      <div className="w-full h-full p-4 flex flex-col font-inter">
        <div className="flex-1 "></div>
        <div className="w-full pb-10">
          <LoginUser />
        </div>
      </div>
    </div>
  );
};

export default page;
