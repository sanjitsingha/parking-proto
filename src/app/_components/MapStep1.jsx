"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapStep1 = ({ details }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !details) return; // only run on client

    if (L.DomUtil.get("leaflet-map")) {
      L.DomUtil.get("leaflet-map")._leaflet_id = null;
    }

    const map = L.map("leaflet-map").setView([details.lat, details.lon], 15);

    // Parking marker
    L.marker([details.lat, details.lon])
      .addTo(map)
      .bindPopup("Parking Space")
      .openPopup();

    // User location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          L.marker([userLat, userLon], {
            icon: L.icon({
              iconUrl:
                "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
              iconSize: [30, 30],
            }),
          })
            .addTo(map)
            .bindPopup("You are here")
            .openPopup();

          // Fit map bounds
          const bounds = L.latLngBounds(
            [userLat, userLon],
            [details.lat, details.lon]
          );
          map.fitBounds(bounds, { padding: [50, 50] });
        },
        (err) => console.error("Location error", err),
        { enableHighAccuracy: true }
      );
    }
  }, [isClient, details]);

  if (!isClient) return null; // avoid SSR errors

  return (
    <div
      id="leaflet-map"
      className="w-full h-[800px] rounded-lg overflow-hidden shadow-lg"
    />
  );
};

export default MapStep1;
