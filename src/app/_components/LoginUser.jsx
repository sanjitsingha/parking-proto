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
import Link from "next/link";
const LoginUser = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState(null);
  const [passwordVisible, setpasswordVisible] = useState(false);

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
        fullname: user.fullname,
        phone_number: user.phone_number,
        vehicle_type: user.vehicle_type,
        favourite: user.favourite || [],
      });

      // redirect after login (example)
      router.back();
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
            placeholder="Phone Number"
            className="bg-gray-100/20 mt-3 w-full text-white text-sm px-4 border outline-none border-yellow rounded-lg py-3"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="w-full relative">
            <input
              placeholder="Password"
              className="bg-gray-100/20 mt-3 w-full text-sm text-white px-4 border outline-none border-yellow rounded-lg py-3"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={handlePasswordToggle}
              className="w-fit h-fit absolute right-3 top-[25px]"
            >
              {passwordVisible ? (
                <EyeOff size={16} color="white" opacity={100} />
              ) : (
                <Eye size={16} color="white" opacity={60} />
              )}
            </span>
          </div>

          {error && (
            <div className="w-full flex mt-2 text-red-400 gap-2 items-center">
              <HelpCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          <div className="w-full mt-3 flex gap-2 items-center justify-center">
            <p className="font-inter text-sm text-white">
              New to eassy parking ?
            </p>

            <Link className="text-yellow text-sm" href={"/register"}>
              Create Account
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow text-black rounded-lg text-sm mt-6 px-4 py-3"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="w-full flex justify-center py-4 items-center">
          <button
            onClick={() => {
              router.back();
            }}
            className="text-yellow flex item-center gap-2"
          >
            <ChevronLeft /> <p className="text-sm">Go Back</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginUser;
