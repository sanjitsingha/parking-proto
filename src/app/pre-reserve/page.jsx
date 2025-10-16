"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BadgeCheckIcon } from "lucide-react";

const PreReserveInner = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useAuthStore();
  const [vehicle, setVehicle] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const [ParkingDetails, setParkingDetails] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  // ✅ Fetch parking space details
  useEffect(() => {
    async function fetchdata() {
      const { data: row, error } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.log(error);
      } else {
        setParkingDetails(row);
      }
    }
    if (id) fetchdata();
  }, [id]);

  // ✅ Handle Submit (Insert into pre_reserve table)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle) return alert("Please select your vehicle type");

    setLoading(true);
    const { id: userId, fullname } = user || {};

    const { error } = await supabase.from("pre_reserve").insert([
      {
        date_time: new Date().toISOString(),
        user_id: userId,
        user_name: fullname,
        vehicle_type: vehicle,
        space_id: ParkingDetails?.id,
        space_owner_id: ParkingDetails?.owner_id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("❌ Error inserting data:", error);
      alert("Failed to reserve. Try again!");
    } else {
      setShowSuccess(true); // ✅ show success popup
    }
  };

  // ✅ Countdown redirect after success
  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0 && ParkingDetails) {
      const redirectUrl = `https://www.google.com/maps/dir/?api=1&destination=${ParkingDetails.lat},${ParkingDetails.lon}&travelmode=driving`;
      router.push(redirectUrl);
    }
  }, [showSuccess, countdown, router, ParkingDetails]);

  // ✅ Open Google Maps Navigation
  const handleOpenMap = () => {
    if (ParkingDetails?.lat && ParkingDetails?.lon) {
      const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${ParkingDetails.lat},${ParkingDetails.lon}&travelmode=driving`;
      window.open(gmapUrl, "_blank");
    }
  };

  return (
    <>
      {/* ✅ Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-blue-dark rounded-xl w-[90%] max-w-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <BadgeCheckIcon size={60} stroke="black" fill="yellow" />
            </div>
            <p className="text-xl font-bold text-white">
              Successful Reservation
            </p>
            <p className="text-sm mt-2 text-white/60">
              Your parking has been reserved successfully.
            </p>
            <p className="text-yellow mt-4">Redirecting in {countdown}s...</p>
            <button
              onClick={handleOpenMap}
              className="py-3 mt-4 bg-yellow rounded-lg w-full text-black"
            >
              Open Google Map
            </button>
          </div>
        </div>
      )}

      {/* ✅ Main Page */}
      <div className="w-full h-[calc(100vh-90px)] bg-blue-light">
        <div className="w-full h-full">
          <div className="h-[400px]"></div>
          <div className="w-full p-4">
            <p className="text-xl text-white font-semibold">Free Reserve</p>
            <p className="text-sm mt-3 text-white/60">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus, ex harum
            </p>
            <div className="w-full text-white">
              <form onSubmit={handleSubmit}>
                <select
                  required
                  className="w-full py-3 mt-5 border-yellow border px-2 bg-blue-dark rounded-full"
                  name="vehicle"
                  id="vehicle"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                >
                  <option value="">Choose your Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow text-black mt-4 py-3 rounded-full w-full px-4"
                >
                  {loading ? "Reserving..." : "Free Reserve"}
                </button>
              </form>
              <button
                onClick={handleOpenMap}
                className="mt-3 underline text-yellow"
              >
                Skip, Open Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading...</div>}>
      <PreReserveInner />
    </Suspense>
  );
}
