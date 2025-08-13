"use client";
import React, { useEffect, useState } from "react";
import { Car, Cctv, SmartphoneCharging } from "lucide-react";
import { getDistanceKm } from "../../utils/distance";
import { useRouter } from "next/navigation";
import { useParkingStore } from "../store/useParkingStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const CurrentLocationParking = () => {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nearbyLots, setNearbyLots] = useState([]);
  const { setSelectedLot } = useParkingStore();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // ✅ Removed setparkingImg from render — use state only if needed later
  const [parkingImg, setParkingImg] = useState(null);

  const fetchNearbyLots = async (coords) => {
    const { data: lots, error } = await supabase
      .from("parking_lots")
      .select("*");

    if (error) {
      console.error("Error fetching lots:", error);
      return;
    }

    const nearby = lots.filter((lot) => {
      const distance = getDistanceKm(coords.lat, coords.lon, lot.lat, lot.lon);
      return distance <= 5;
    });

    setNearbyLots(nearby);

    // If you want to save first image from the first lot
    if (nearby.length > 0 && nearby[0].images?.length > 0) {
      setParkingImg(nearby[0].images[0]);
    }
  };

  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setSelectedCoords(coords);
        await fetchNearbyLots(coords);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Permission denied or error getting location");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  };

  const handleSelectLot = (lot) => {
    setSelectedLot(lot);

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
      {nearbyLots.length > 0 && (
        <div className="  mb-2 rounded-md p-2">
          {nearbyLots.map((lot) => (
            <div
              onClick={() => handleSelectLot(lot)}
              key={lot.id}
              className="p-2 cursor-pointer my-4 bg-white"
            >
              <div className="w-full bg-red-200 flex">
                <div className="w-[30%]">
                  {/* ✅ Show only first image */}
                  {lot.images?.[0] && (
                    <Image
                      alt="Parking Lot"
                      width={100}
                      height={100}
                      src={lot.images[0]}
                    />
                  )}
                </div>
                <div className="w-[70%]">
                  <p className="text-xl font-medium">{lot.name}</p>
                </div>
              </div>

              <div className="w-full flex">
                <span className="flex-1"></span>
                <span className="bg-green-400/50 px-1 py-0.5 rounded-sm">
                  <p>
                    {lot.price_per_hour}
                    {"/hr"}
                  </p>
                </span>
              </div>

              <div className="w-full mt-3 flex flex-col gap-2">
                <span className="flex items-center gap-2">
                  <Car size={32} />
                  <p>{lot.category}</p>
                </span>
                <span className="flex items-center gap-2">
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
