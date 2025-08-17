"use client";
import { useState, useEffect } from "react";

export function useGeolocation() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return position;
}
