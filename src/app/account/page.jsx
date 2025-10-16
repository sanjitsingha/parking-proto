"use client";
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import AboutSnippet from "../_components/AboutSnippet";
import Link from "next/link";
import { HeartPlusIcon, Keyboard, Lock } from "lucide-react";
import ChangePassword from "../_components/ChangePassword";

const page = () => {
  const router = useRouter();
  const handleLogout = () => {
    clearUser();
    router.push("/explore");
  };

  const { clearUser } = useAuthStore();
  const { user } = useAuthStore();
  return (
    <div className="w-full h-[calc(100vh-90px)] relative  font-inter bg-blue-light">
      <div className="w-full py-10 px-4">
        <div className="flex py-3 rounded-xl bg-blue-dark items-center gap-3 ">
          <div className="w-full">
            <p className="text-white text-xl ml-3">{user?.fullname}</p>
            <p className="text-white/40 mt-2 text-xs ml-3">
              {user?.phone_number}
            </p>
          </div>
        </div>
        <hr className="text-white bg-white opacity-10 my-4" />
        <div className="w-full">
          <button
            onClick={() => {
              router.push("/favourite");
            }}
            className="flex w-full rounded-full items-center bg-blue-dark gap-3 py-3 px-4 text-white "
          >
            <HeartPlusIcon size={18} />{" "}
            <p className="text-sm">Space Wishlist</p>
          </button>
          <button
            onClick={() => {
              router.push("/account/change-password");
            }}
            className="flex w-full rounded-full mt-3 items-center bg-blue-dark gap-3 py-3 px-4 text-white "
          >
            <Keyboard size={18} /> <p className="text-sm">Change Password</p>
          </button>
          <button
            onClick={handleLogout}
            className="flex mt-3 w-full rounded-full items-center bg-red-600 gap-3 py-3 px-4 text-white "
          >
            <Lock size={18} /> <p className="text-sm">Logout</p>
          </button>
        </div>
      </div>

      <AboutSnippet />
    </div>
  );
};

export default page;
