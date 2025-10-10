"use client";
import { Bike, Car } from "lucide-react";
import React, { useState } from "react";
import { registerUser } from "@/lib/supabaseAuth";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterUser = () => {
  const [fullname, setFullName] = useState("");
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle_type, setVehicleType] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const router = useRouter();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await registerUser(
        fullname,
        phone_number,
        password,
        vehicle_type
      );
      setUser({
        id: user.id,
        phone_number: user.phone_number,
        fullname: user.fullname,
        vehicle_type: user.vehicle_type,
      });
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
        <form onSubmit={handleRegister}>
          <input
            placeholder="Full Name"
            className="bg-gray-100/20 w-full text-lg text-white px-4 border outline-none border-yellow rounded-lg py-3"
            type="text"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            placeholder="Phone Number"
            className="bg-gray-100/20 mt-3 w-full text-lg text-white px-4 border outline-none border-yellow rounded-lg py-3"
            type="number"
            value={phone_number}
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
                  className="inline-flex items-center justify-between w-fit p-5 text-black bg-white border-2 border-white rounded-lg cursor-pointer peer-checked:bg-yellow hover:bg-gray-50"
                >
                  <Bike size={32} />
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
                  className="inline-flex items-center justify-between w-fit p-5 text-black bg-white border-2 border-white rounded-lg cursor-pointer peer-checked:bg-yellow hover:bg-gray-50"
                >
                  <Car size={32} />
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
          <div className="w-full mt-3 flex gap-2 items-center justify-center">
            <p className="font-inter text-white">Already has account ?</p>

            <Link className="text-yellow" href={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterUser;
