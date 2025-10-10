"use client";
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import AboutSnippet from "../_components/AboutSnippet";
import Link from "next/link";
import { Lock } from "lucide-react";
import ChangePassword from "../_components/ChangePassword";

const page = () => {
  const [popUp, setpopUp] = useState(false);

  const router = useRouter();
  const handleLogout = () => {
    clearUser();
    router.push("/explore");
  };

  const { clearUser } = useAuthStore();
  const { user } = useAuthStore();
  return (
    <div className="w-full h-[calc(100vh-90px)] relative  font-inter bg-blue-light">
      <div className="popup  bg-blue-dark w-full p-4 absolute rounded-t-3xl h-[300px] bottom-0 left-0">
        <ChangePassword />
      </div>

      <div className="w-full py-10 px-4">
        <div className="flex items-center gap-3 ">
          <div className="bg-yellow rounded-full h-20 w-20"></div>
          <p className="text-white">{user?.fullname}</p>
        </div>

        <div className="w-full mt-10">
          <button className="flex w-full rounded-full items-center bg-blue-dark gap-3 py-3 px-4 text-white ">
            <Lock size={18} /> <p>Change Password</p>
          </button>
          <button
            onClick={handleLogout}
            className="flex mt-3 w-full rounded-full items-center bg-red-600 gap-3 py-3 px-4 text-white "
          >
            <Lock size={18} /> <p>Logout</p>
          </button>
        </div>
      </div>

      <AboutSnippet />
    </div>
  );
};

export default page;
