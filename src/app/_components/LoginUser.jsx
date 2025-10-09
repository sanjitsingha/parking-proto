"use client";
import React, { useEffect, useState } from "react";
import { loginUser } from "@/lib/supabaseAuth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { usePathname } from "next/navigation";

const LoginUser = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

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
      alert(error.message);
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
            className="bg-gray-100/20 mt-3 w-full text-lg text-white px-4 border outline-none border-yellow rounded-lg py-3"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            className="bg-gray-100/20 mt-3 w-full text-lg text-white px-4 border outline-none border-yellow rounded-lg py-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow text-black rounded-lg mt-6 px-4 py-3"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginUser;
