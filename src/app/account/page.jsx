"use client";
import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import AboutSnippet from "../_components/AboutSnippet";
import Link from "next/link";
import { Lock } from "lucide-react";
import ChangePassword from "../_components/ChangePassword";

const page = () => {
  const router = useRouter();
  const handleLogout = () => {
    clearUser();
    router.push("/explore");
  };

  const { clearUser } = useAuthStore();
  const { user } = useAuthStore();
  console.log(user);
  return (
    <div className="w-full h-[calc(100vh-90px)] relative  font-inter bg-blue-light">
      <div className="popup bg-blue-dark w-full p-4 absolute rounded-t-3xl h-[300px] bottom-0 left-0">
        <ChangePassword />
      </div>
      <div className="w-full p-4">
        <p className=" text-white">Hi, there!</p>
        {/* <p>{user?.fullname}</p> */}
        <div className="w-full">
          <button className="flex w-full rounded-full items-center bg-blue-dark gap-3 py-3 px-4 text-white ">
            <Lock size={18} /> <p>Change Password</p>
          </button>
        </div>
      </div>
      <button onClick={handleLogout}>logout</button>
      <AboutSnippet />
    </div>
  );
};

export default page;
