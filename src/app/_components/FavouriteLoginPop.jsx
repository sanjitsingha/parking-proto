"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const FavouriteLoginPop = ({ show, onClose }) => {
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id === "fav-login-overlay") {
        onClose();
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <>
      {/* Background overlay */}
      <div
        id="fav-login-overlay"
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-end z-[999] transition-opacity duration-300 ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Bottom popup box */}
        <div
          className={`bg-blue-dark p-5 w-full sm:w-[400px] rounded-t-2xl text-white shadow-xl transform transition-transform duration-500 ${
            show ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <p className="text-xl font-semibold font-inter">
            You’re not logged in
          </p>
          <p className="text-sm text-white/70 font-inter mt-2">
            Add your favourite spaces and access them easily later.
          </p>

          <button
            onClick={() => {
              router.push("/login");
            }}
            type="submit"
            className="w-full bg-yellow text-black rounded-lg mt-6 mb-12 px-4 py-3"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default FavouriteLoginPop;
