"use client";
import React, { useEffect, useState } from "react";
import {
  Car,
  Cctv,
  ChartColumnBigIcon,
  LocationEdit,
  SmartphoneCharging,
} from "lucide-react";
import { getDistanceKm } from "../../utils/distance";
import { useRouter } from "next/navigation";
import { useParkingStore } from "../store/useParkingStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const CurrentLocationParking = () => {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nearbyLots, setNearbyLots] = useState([]);
  const { setSelectedLot } = useParkingStore();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setSelectedCoords(coords);

        // Fetch parking lots from Supabase
        const { data: lots, error } = await supabase
          .from("parking_lots")
          .select("*");

        if (error) {
          console.error("Error fetching lots:", error);
          return;
        } else {
          console.log("Fetched data:", lots);
        }

        // Filter within 5km radius
        const nearby = lots.filter((lot) => {
          const distance = getDistanceKm(
            coords.lat,
            coords.lon,
            lot.lat,
            lot.lon
          );
          return distance <= 5;
        });

        setNearbyLots(nearby);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Permission denied or error getting location");
      }
    );
  };

  const handleSelectLot = (lot) => {
    setSelectedLot(lot); // Store parking lot in Zustand

    if (selectedCoords) {
      router.push(
        `/directions?lat=${selectedCoords.lat}&lon=${selectedCoords.lon}`
      );
    } else {
      alert("Please get your current location first");
    }
  };

  return (
    <div className="md:w-[400px] w-full h-fit p-2 bg-gray-200">
      {/* Nearby Parking Lots */}
      {nearbyLots.length > 0 && (
        <div className="mt-4 bg-white rounded-md p-2">
          {nearbyLots.map((lot) => (
            <div
              onClick={() => handleSelectLot(lot)}
              key={lot.id}
              className=" p-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="w-full flex ">
                <span className="flex-1">
                  <p className="text-xl font-medium">{lot.name}</p>
                </span>
                <span className="bg-green-400/50 px-1 py-0.5 rounded-sm">
                  <p>
                    {lot.price_per_hour}
                    {"/hr"}
                  </p>
                </span>
              </div>
              <div className="w-full mt-3 flex flex-col gap-2">
                <span className="flex items-center gap-2 ">
                  <Car size={32} />
                  <p>{lot.category}</p>
                </span>
                <span className="flex items-center gap-2 ">
                  <Cctv size={32} />
                  <p>{lot.cctv && "CCTV Available"}</p>
                </span>
                <span className="flex items-center gap-2">
                  {lot.ev_charging === 1 ? (
                    <>
                      <SmartphoneCharging size={32} />
                      <span>EV Charging Available</span>
                    </>
                  ) : (
                    <>
                      <SmartphoneCharging size={32} />
                      <span>Not Available</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentLocationParking;
