"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components (no SSR errors)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

export default function Page() {
  const [position, setPosition] = useState(null);
  const targetLocation = { lat: 26.582095, lng: 88.268295 }; // Example target (parking lot) 26.582095, 88.268295

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy, // meters
        });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!position) {
    return (
      <div className="flex items-center justify-center h-screen">
        📍 Getting location...
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔵 Current location */}
        <CircleMarker
          center={[position.lat, position.lng]}
          radius={8}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 1 }}
        />

        {/* 🔵 Accuracy circle */}
        <Circle
          center={[position.lat, position.lng]}
          radius={position.accuracy}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
        />

        {/* 🔴 Target location */}
        <CircleMarker
          center={[targetLocation.lat, targetLocation.lng]}
          radius={8}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
        />
      </MapContainer>
    </div>
  );
}
