"use client";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "../hook/useGeolocation";
import { CurrentLocationIcon } from "./CurrentLocationMarker";
import LocationPointer from "./LocationPointer";

export default function MapComponent() {
  const { position } = useGeolocation();

  // Example fixed coordinates for red pointer
  const customCoordinates = { lat: 26.73, lng: 88.4 };

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={position ? [position.lat, position.lng] : [26.7271, 88.3953]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Base map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Blue current location marker */}
        {position && (
          <Marker
            position={[position.lat, position.lng]}
            icon={CurrentLocationIcon}
          />
        )}

        {/* Red custom pointer */}
        <LocationPointer coordinates={customCoordinates} />
      </MapContainer>
    </div>
  );
}
