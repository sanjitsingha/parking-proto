"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "../hook/useGeolocation";
import { CurrentLocationIcon } from "./CurrentLocationMarker";

export default function MapComponent() {
  const { position } = useGeolocation();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([26.7271, 88.3953], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (position && mapRef.current) {
      const { lat, lng, accuracy } = position;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: CurrentLocationIcon,
        }).addTo(mapRef.current);
      }

      // Accuracy circle (like Google Maps)
      L.circle([lat, lng], {
        radius: accuracy,
        color: "#2563eb",
        fillColor: "#60a5fa",
        fillOpacity: 0.2,
      }).addTo(mapRef.current);

      mapRef.current.setView([lat, lng], 16);
    }
  }, [position]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
