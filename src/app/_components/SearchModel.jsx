"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import {
  BatteryChargingIcon,
  Bike,
  BikeIcon,
  Car,
  Cctv,
  MapPin,
  SmartphoneCharging,
  Star,
  View,
} from "lucide-react";
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
    <div className="md:w-[400px]v pt-28 w-full h-[100vh] p-4 bg-gray-200">
      <div className="w-full">
        <p className="text-lg font-raleway">Nearest Parking (500m)</p>
      </div>
      {nearbyLots.length > 0 && (
        <div className="  mb-2 rounded-md">
          {nearbyLots.map((lot) => (
            <div
              key={lot.id}
              className="p-3 cursor-pointer my-4 rounded-2xl bg-white"
            >
              <div className="w-full gap-2 flex">
                <div className="w-[30%]">
                  {/* ✅ Show only first image */}
                  {lot.images?.[0] && (
                    <Image
                      alt="Parking Lot"
                      width={100}
                      height={100}
                      src={lot.images[0]}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  )}
                </div>
                <div className="w-[70%]">
                  <div className="flex justify-between ">
                    <p className="text-[16px] font-raleway font-medium">
                      {lot.name}
                    </p>
                    <span className="flex h-fit bg-green-200 px-2 py-0.5 rounded-md items-center gap-1">
                      <Star size={14} />
                      <p className="text-sm">20m</p>
                    </span>
                  </div>
                  <div>
                    <p className="font-raleway text-sm">
                      {/* ev charging */}
                      <span className="flex  items-center gap-1">
                        <Star size={14} />

                        {"4.3 (100+ Reviews)"}
                      </span>
                    </p>
                    <p className="font-raleway text-sm">
                      {/* ev charging */}
                      <span className="flex  items-center gap-1">
                        <BatteryChargingIcon size={14} />

                        {" EV Charging Available"}
                      </span>
                    </p>
                    <p className="font-raleway text-sm">
                      {/* ev charging */}
                      <span className="flex  items-center gap-1">
                        <Cctv size={14} />

                        {"CCTV Available"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full mt-4 gap-8  h-[48px] flex">
                <div className="w-1/2 rounded-md  flex justify-center items-center  bg-red-200">
                  <button
                    onClick={() => router.push(`/details/${lot.id}`)}
                    className="flex items-center gap-2"
                  >
                    <span className="font-semibold font-raleway">Details</span>
                  </button>
                </div>
                <div className="w-1/2 flex rounded-md  items-center justify-center bg-green-300">
                  <button
                    // onClick={handleSelectLot}
                    className="flex items-center gap-2"
                  >
                    <span className="font-semibold font-raleway">
                      Park Here
                    </span>
                    <MapPin />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentLocationParking;
