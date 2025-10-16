"use client";
import { Menu, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import logowhite from "../../../public/logo/easy-parking-logo-white.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar2 = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [navExpanded, setnavExpanded] = useState(false);
  const menuRef = useRef(null);

  const toggleNav = () => {
    setnavExpanded(!navExpanded);
  };

  const closeNav = () => {
    setnavExpanded(false);
  };

  // 👇 Detect click outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        navExpanded
      ) {
        setnavExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navExpanded]);

  const handleNavigate = () => {
    router.push("/explore");
  };

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
          <button
            onClick={toggleNav}
            className="z-20 transition-all duration-150 ease-in-out"
          >
            {navExpanded ? (
              <X
                color="white"
                className="transition-all duration-150 ease-in-out"
                size={26}
              />
            ) : (
              <Menu
                color="white"
                className="transition-all duration-150 ease-in-out"
                size={26}
              />
            )}
          </button>
        </div>

        <div
          ref={menuRef} // 👈 ref added here
          className={`w-full transition-all duration-400 ease-in-out flex flex-col absolute ${navExpanded
              ? "-translate-y-[0] opacity-100"
              : "-translate-y-[300px] opacity-0"
            } border-t px-6 border-white/10 bg-[#18191f]`}
        >
          {user ? (
            <Link
              href="/account"
              onClick={closeNav}
              className="text-white font-inter border-b py-2.5 border-white/5"
            >
              My Account
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={closeNav}
              className="text-white font-inter border-b py-2.5 border-white/5"
            >
              Login
            </Link>
          )}

          {user && (
            <Link
              href="/favourite"
              onClick={closeNav}
              className="text-white font-inter border-b py-2.5 border-white/5"
            >
              Space Wishlist
            </Link>
          )}

          <Link
            href="/"
            onClick={closeNav}
            className="text-white font-inter border-b py-2.5 border-white/5"
          >
            About
          </Link>
          <Link
            href="/"
            onClick={closeNav}
            className="text-white font-inter border-b py-2.5 border-white/5"
          >
            Help
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar2;
