"use client";
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import AboutSnippet from "../_components/AboutSnippet";
import Link from "next/link";
import {
  BellDotIcon,
  HeartPlusIcon,
  Keyboard,
  LayoutListIcon,
  Lock,
} from "lucide-react";
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
          <div className="mr-3">
            <button
              onClick={handleLogout}
              className="flex  rounded-full text-white items-center bg-yellow/30 border border-yellow gap-1 py-2 px-4 "
            >
              <Lock size={14} /> <p className="text-xs ">Logout</p>
            </button>
          </div>
        </div>
        <hr className="text-white bg-white opacity-10 my-4" />
        <div className="w-full">
          <button
            onClick={() => {
              router.push("/notifications");
            }}
            className="flex w-full rounded-full items-center bg-blue-dark gap-3 py-3 px-4 text-white "
          >
            <BellDotIcon size={18} />
            <p className="text-sm">Notifications</p>
          </button>
          <button
            onClick={() => {
              router.push("/history");
            }}
            className="flex w-full mt-3 rounded-full items-center bg-blue-dark gap-3 py-3 px-4 text-white "
          >
            <LayoutListIcon size={18} />
            <p className="text-sm">Parking History</p>
          </button>
          <button
            onClick={() => {
              router.push("/favourite");
            }}
            className="flex w-full mt-3 rounded-full items-center bg-blue-dark gap-3 py-3 px-4 text-white "
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
        </div>
      </div>

      <AboutSnippet />
    </div>
  );
};

export default page;
