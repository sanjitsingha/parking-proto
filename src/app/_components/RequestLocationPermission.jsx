"use client";
import React, { useState } from "react";

const RequestLocationPermission = ({ onSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    setError(null);
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Your browser does not support Geolocation.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        onSuccess(coords); // send back to parent component
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied. Please allow access.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Location not available. Try again.");
        } else {
          setError("Error fetching location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <button
        onClick={requestLocation}
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Getting location..." : "Enable Location Access"}
      </button>
      {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default RequestLocationPermission;
