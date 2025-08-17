"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import LocationPointer from "../_components/LocationPointer";
import CurrentLocationMarker from "../_components/CurrentLocationMarker";
import { useGeolocation } from "../hook/useGeolocation";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function Page() {
  const coordinates = { lat: 26.583445, lng: 88.26774 }; // red pointer
  const position = useGeolocation(); // live blue dot

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {/* Red static location */}
      <LocationPointer coordinates={coordinates} />

      {/* Blue moving dot (your current location) */}
      <CurrentLocationMarker coordinates={position} />
    </MapContainer>
  );
}
