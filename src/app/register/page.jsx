"use client";
import React, { useEffect } from "react";
import RegisterUser from "../_components/RegisterUser";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

const page = () => {
  const { user } = useAuthStore();
  const url = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user && url === "/register") {
      router.replace("/account");
    }
  }, [user, url, router]);

  console.log(url);
  return (
    <div className="w-full h-[calc(100vh-90px)] bg-blue-light">
      <div className="w-full h-full p-4 flex flex-col font-inter">
        <div className="flex-1 "></div>
        <div className="w-full pb-10">
          <RegisterUser />
        </div>
      </div>
    </div>
  );
};

export default page;
