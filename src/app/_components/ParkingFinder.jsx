"use client";

import { useState } from "react";
import { findNearbyParkingLots } from "@/utils/geo";

export default function ParkingFinder() {
  const [nearby, setNearby] = useState([]);
  const [error, setError] = useState("");

  const handleFindParking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const lots = findNearbyParkingLots(lat, lon, 5); // 5 km radius
          setNearby(lots);
          setError("");
        },
        () => {
          setError("Location access denied");
        }
      );
    } else {
      setError("Geolocation not supported");
    }
  };

  return (
    <div>
      <button onClick={handleFindParking}>Find Parking Near Me</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {nearby.length === 0 && !error && <li>No parking found nearby</li>}
        {nearby.map((lot) => (
          <li key={lot.id}>{lot.name}</li>
        ))}
      </ul>
    </div>
  );
}
