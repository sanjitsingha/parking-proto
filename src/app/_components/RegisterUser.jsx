"use client";
import { Bike, Car } from "lucide-react";
import React, { useState } from "react";
import { registerUser } from "@/lib/supabaseAuth";
import { useAuthStore } from "../store/useAuthStore";

const RegisterUser = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleType, setVehicleType] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await registerUser(fullName, phone, password, vehicleType);
      setUser({
        id: data.id,
        phone: data.phone,
        full_name: data.full_name,
        vehicle_type: data.vehicle_type,
      });
      alert(`✅ Welcome ${user.full_name}! Registration successful.`);
      // redirect if needed
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <form onSubmit={handleRegister}>
          <input
            placeholder="Full Name"
            className="bg-gray-100/20 w-full text-lg text-white px-4 border outline-none border-yellow rounded-lg py-3"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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

          <div className="w-full mt-3">
            <p className="text-white ">
              Type of Vehicle <span className="opacity-50">(Optional)</span>
            </p>
            <div className="w-full flex mt-4 items-center gap-4">
              <div>
                <input
                  type="radio"
                  id="bike-option"
                  name="vehicle"
                  className="hidden peer"
                  onChange={() => setVehicleType("bike")}
                />
                <label
                  htmlFor="bike-option"
                  className="inline-flex items-center justify-between w-fit p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:bg-gray-50"
                >
                  <Bike />
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="car-option"
                  name="vehicle"
                  className="hidden peer"
                  onChange={() => setVehicleType("car")}
                />
                <label
                  htmlFor="car-option"
                  className="inline-flex items-center justify-between w-fit p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:bg-gray-50"
                >
                  <Car />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow text-black rounded-lg mt-6 px-4 py-3"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterUser;
