"use client";
import { Menu, User2, UserCircle, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import logowhite from "../../../public/logo/easy-parking-logo-white.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar2 = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleNavigate = () => {
    router.push("/explore");
  };
  console.log(user);
  return (
    <div className="w-full fixed left-0 z-50 top-0 bg-[#18191F]">
      <nav className="w-full relative">
        <div className="flex items-center h-[90px] justify-between px-6">
          <div onClick={handleNavigate}>
            <Image
              className="z-10"
              src={logowhite}
              alt="logo"
              width={120}
              height={80}
            />
          </div>
          {user ? (
            <div
              onClick={() => {
                router.push("/account");
              }}
              className="bg-blue-light p-2 rounded-full"
            >
              <User2 color="#FDC700" />
            </div>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
              }}
              className="text-yellow font-inter font-medium"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar2;
