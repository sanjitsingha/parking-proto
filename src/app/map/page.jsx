"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid "window is not defined"
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

export default function Page() {
  const currentLocation = { lat: 26.583445, lng: 88.26774 }; // Example user location
  const targetLocation = { lat: 26.6002, lng: 88.2856 }; // Example parking lot

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Current location - blue dot */}
        <CircleMarker
          center={[currentLocation.lat, currentLocation.lng]}
          radius={8}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 1 }}
        />

        {/* Target location - red dot */}
        <CircleMarker
          center={[targetLocation.lat, targetLocation.lng]}
          radius={8}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 1 }}
        />
      </MapContainer>
    </div>
  );
}
