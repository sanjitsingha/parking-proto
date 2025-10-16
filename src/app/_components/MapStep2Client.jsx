"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-moving-marker";

const MapStep2Client = ({ details }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!details) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map("leaflet-map").setView([details.lat, details.lon], 15);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: ["a", "b", "c"],
    }).addTo(map);

    // Parking marker
    L.marker([details.lat, details.lon])
      .addTo(map)
      .bindPopup("Parking Space")
      .openPopup();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const userMarker = L.marker([userLat, userLon], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
            iconSize: [30, 30],
          }),
        }).addTo(map);
        userMarkerRef.current = userMarker;

        const bounds = L.latLngBounds(
          [userLat, userLon],
          [details.lat, details.lon]
        );
        map.fitBounds(bounds, { padding: [50, 50] });

        // OSRM route
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${details.lon},${details.lat}?overview=full&geometries=geojson`
          );
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c) => [
              c[1],
              c[0],
            ]);
            setRouteCoords(coords);
            L.polyline(coords, { color: "yellow", weight: 5 }).addTo(map);
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  }, [details]);

  // Start Navigation
  const startNavigation = () => {
    if (!routeCoords.length || !mapRef.current) return;

    const movingMarker = L.Marker.movingMarker(routeCoords, 10000, {
      autostart: true,
      icon: L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png", // arrow icon
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
    }).addTo(mapRef.current);

    mapRef.current.flyTo(routeCoords[0], 17, { duration: 2 });
  };

  return (
    <div className="relative">
      <div
        id="leaflet-map"
        className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg"
      />
      <button
        onClick={startNavigation}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        Start Navigation
      </button>
    </div>
  );
};

export default MapStep2Client;
