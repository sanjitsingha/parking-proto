"use client";
import React, { useState } from "react";
import { LocationEdit } from "lucide-react";
import { parkingLots } from "@/data/parkingLots";
import { getDistanceKm } from "../../utils/distance";
import { useRouter } from "next/navigation";
import { useParkingStore } from "../store/useParkingStore";

const CurrentLocationParking = () => {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nearbyLots, setNearbyLots] = useState([]);
  const { setSelectedLot } = useParkingStore();
  const router = useRouter();

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setSelectedCoords(coords);

        const nearby = parkingLots.filter((lot) => {
          const distance = getDistanceKm(
            coords.lat,
            coords.lon,
            lot.lat,
            lot.lon
          );
          return distance <= 5; // within 5 km
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

    // Pass only user coords via query params
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
      {/* Current Location Button */}
      <div className="w-full mt-2 bg-green-400 rounded-md h-[60px]">
        <button
          onClick={handleGetCurrentLocation}
          className="w-full justify-center cursor-pointer flex items-center gap-2 h-full"
        >
          Get Current Location
          <LocationEdit size={20} />
        </button>
      </div>

      {/* Show Coords */}
      {selectedCoords && (
        <p className="mt-2 text-sm text-gray-600">
          Your Location: {selectedCoords.lat.toFixed(4)},{" "}
          {selectedCoords.lon.toFixed(4)}
        </p>
      )}

      {/* Nearby Parking Lots */}
      {nearbyLots.length > 0 && (
        <div className="mt-4 bg-white rounded-md p-2">
          <h3 className="font-bold mb-2">Nearby Parking Lots (within 5km)</h3>
          {nearbyLots.map((lot) => (
            <div
              onClick={() => handleSelectLot(lot)}
              key={lot.id}
              className="border-b py-1 cursor-pointer hover:bg-gray-100"
            >
              {lot.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentLocationParking;
