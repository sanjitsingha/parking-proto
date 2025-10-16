"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { PhoneForwarded, Lock } from "lucide-react";

const RequestPhoneNumber = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const handleViewNumber = () => {
    if (!user) {
      // save redirect path before login
      localStorage.setItem("redirectAfterLogin", pathname);
      router.push("/login");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setShowPhone(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-yellow border-2 border-yellow/20 my-3 flex items-center justify-between rounded-md p-3">
        <p className="text-sm font-medium text-black/80">
          Request Phone Number
        </p>

        {/* Initial Button */}
        {!showPhone && !loading && (
          <button
            onClick={handleViewNumber}
            className="bg-white hover:bg-yellow-100 transition-all py-2 px-4 gap-2 flex items-center rounded-full shadow-sm"
          >
            <PhoneForwarded size={18} />
            <p className="text-sm font-medium">Phone Number</p>
          </button>
        )}

        {/* Loading Dots */}
        {loading && (
          <div className="flex items-center justify-center gap-1 px-4 py-2">
            <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
          </div>
        )}

        {/* Show Phone */}
        {showPhone && (
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-black/70" />
            <p className="text-lg font-semibold tracking-wide">
              +91 8116119282
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPhoneNumber;
