"use client";
import { Menu, NonBinary, X } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

const Navbar2 = () => {
  const [navExpanded, setnavExpanded] = useState(false);

  const toggleNav = () => {
    setnavExpanded(!navExpanded);
  };

  return (
    <div className="w-full fixed left-0 z-50 top-0 bg-[#18191F]  ">
      <nav className="w-full relative    ">
        <div className="flex  items-center h-[90px]  justify-between px-6  ">
          <div>
            <img
              className="z-10"
              src="/yatrisathi.png"
              alt="logo"
              width={100}
              height={80}
            />
          </div>
          <button
            onClick={toggleNav}
            className="z-20 transition-all duration-150 ease-in-out"
          >
            {navExpanded ? (
              <X
                color="white "
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
          className={`w-full transition-all duration-400 ease-in-out flex flex-col absolute ${
            navExpanded
              ? "-translate-y-[0] opacity-100 "
              : "-translate-y-[300px] opacity-0"
          }  border-t px-6 border-white/10 bg-[#18191f] h-[150px]`}
        >
          <Link
            className="text-white font-inter  border-b py-2.5 border-white/5 "
            href={"/"}
          >
            My Account
          </Link>
          <Link
            className="text-white font-inter  border-b py-2.5 border-white/5 "
            href={"/"}
          >
            About
          </Link>
          <Link
            className="text-white font-inter  border-b py-2.5 border-white/5 "
            href={"/"}
          >
            Help
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar2;
