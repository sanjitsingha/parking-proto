"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "motion/react";
import { BadgeCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import FavouriteLoginPop from "@/app/_components/FavouriteLoginPop"; // ✅ for login popup

export default function PreReservePopup({ details, onClose }) {
  const { user, fetchUserData } = useAuthStore();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [vehicle, setVehicle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // ✅ Check login before reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle) return alert("Please select your vehicle type");

    // If not logged in, open login popup
    if (!user?.id) {
      setShowLoginPopup(true);
      return;
    }

    setLoading(true);
    const { id: userId, fullname } = user || {};

    const { error } = await supabase.from("pre_reserve").insert([
      {
        date_time: new Date().toISOString(),
        user_id: userId,
        user_name: fullname,
        vehicle_type: vehicle,
        space_id: details?.id,
        space_owner_id: details?.owner_id,
      },
    ]);

    setLoading(false);
    if (error) {
      console.error(error);
      alert("Reservation failed. Try again!");
    } else {
      setShowSuccess(true);
    }
  };

  // ✅ Countdown then open Google Maps
  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0 && details) {
      const redirectUrl = `https://www.google.com/maps/dir/?api=1&destination=${details.lat},${details.lon}&travelmode=driving`;
      window.location.href = redirectUrl;
    }
  }, [showSuccess, countdown, details]);

  const handleOpenMap = () => {
    if (details?.lat && details?.lon) {
      const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${details.lat},${details.lon}&travelmode=driving`;
      window.open(gmapUrl, "_blank");
    }
  };

  // ✅ After login success
  const handleLoginClose = async () => {
    await fetchUserData(); // refresh Zustand user
    setShowLoginPopup(false);

    // if user is now logged in, retry reservation automatically
    if (useAuthStore.getState().user?.id) {
      console.log("✅ User logged in, returning to pre-reserve flow");
    }
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />

      {/* Sliding Popup */}
      <motion.div
        key="panel"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-0 left-0 w-full bg-blue-dark rounded-t-2xl p-6 z-50 shadow-lg text-white"
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Pre-Reserve</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ✕
          </button>
        </div>

        {!showSuccess ? (
          <form onSubmit={handleSubmit}>
            <p className="text-sm mb-3 text-white/70">
              Choose your vehicle type to reserve this space.
            </p>

            <select
              required
              className="w-full py-3 border border-yellow-400 bg-transparent rounded-full px-2 text-white"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-yellow-400 text-black rounded-full"
            >
              {loading ? "Reserving..." : "Free Reserve"}
            </button>

            <button
              type="button"
              onClick={handleOpenMap}
              className="mt-3 underline text-yellow-400 w-full"
            >
              Skip, Open Map
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <BadgeCheckIcon size={60} stroke="black" fill="yellow" />
            </div>
            <p className="text-lg font-bold">Successful Reservation</p>
            <p className="text-sm mt-1 text-white/60">
              Your parking has been reserved successfully.
            </p>
            <p className="mt-2 text-yellow-400">
              Redirecting in {countdown}s...
            </p>
            <button
              onClick={handleOpenMap}
              className="w-full mt-4 py-3 bg-yellow-400 text-black rounded-full"
            >
              Open Google Map
            </button>
          </div>
        )}
      </motion.div>

      {/* ✅ Login Popup */}
      {showLoginPopup && (
        <FavouriteLoginPop show={showLoginPopup} onClose={handleLoginClose} />
      )}
    </AnimatePresence>
  );
}
