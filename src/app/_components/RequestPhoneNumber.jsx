"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { PhoneForwarded, Lock } from "lucide-react";

const RequestPhoneNumber = ({ details }) => {
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
      <div className="w-full bg-blue-dark border-2 border-blue-light my-3 flex items-center justify-between rounded-md p-3">
        <p className="text-sm font-inter text-white">Request Phone Number</p>

        {/* Initial Button */}
        {!showPhone && !loading && (
          <button
            onClick={handleViewNumber}
            className="bg-blue-light hover:bg-yellow-100 transition-all py-2 px-4 gap-2 flex items-center rounded-full shadow-sm"
          >
            <PhoneForwarded color="white" size={18} />
            <p className="text-sm text-white font-medium">Phone Number</p>
          </button>
        )}

        {/* Loading Dots */}
        {loading && (
          <div className="flex items-center justify-center gap-1 px-4 py-2">
            <span className="w-2 h-2 bg-yellow rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-yellow rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-yellow rounded-full animate-bounce"></span>
          </div>
        )}

        {/* Show Phone */}
        {showPhone && (
          <div className="flex bg-blue-light py-2 px-4 rounded-full items-center gap-2">
            <Lock size={16} className="text-white" />
            <p className="text-white tracking-wide">{details.contact_number}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPhoneNumber;
