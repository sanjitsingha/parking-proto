"use client";
import React, { useEffect, useState } from "react";
import { loginUser } from "@/lib/supabaseAuth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Eye,
  EyeClosedIcon,
  EyeOff,
  HelpCircle,
} from "lucide-react";

const ChangePassword = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState(null);
  const [passwordVisible, setpasswordVisible] = useState(true);

  const handlePasswordToggle = () => {
    setpasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await loginUser(phone, password);
      // Set user in Zustand store (persisted in localStorage automatically)
      setUser({
        id: user.id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        vehicle_type: user.vehicle_type,
        favourite: user.favourite || [],
      });

      // redirect after login (example)
      router.push("/explore");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full">
        <form onSubmit={handleLogin}>
          <input
            placeholder="Current Password"
            className="bg-gray-100/20 mt-3 w-full text-white px-4 border outline-none border-yellow rounded-lg py-3"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="w-full relative">
            <input
              placeholder="New Password"
              className="bg-gray-100/20 mt-3 w-full  text-white px-4 border outline-none border-yellow rounded-lg py-3"
              type={passwordVisible ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={handlePasswordToggle}
              className="w-fit h-fit absolute right-3 top-[25px]"
            >
              {passwordVisible ? (
                <EyeOff color="white" opacity={100} />
              ) : (
                <Eye color="white" opacity={60} />
              )}
            </span>
          </div>

          {error && (
            <div className="w-full flex mt-2 text-red-400 gap-2 items-center">
              <HelpCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow text-black rounded-lg mt-6 px-4 py-3"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
        <button
          onClick={() => {
            router.back();
          }}
          className="flex mx-auto mt-4 items-center"
        >
          <ChevronLeft color="#fdc700" size={18} />
          <p className="text-yellow font-inter">Go Back</p>
        </button>
      </div>
    </>
  );
};

export default ChangePassword;
