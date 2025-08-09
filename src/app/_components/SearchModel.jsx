"use client";
import { parkingLots } from "../../data/parkingLots";
import { LocationEdit, Map, SearchCheck } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Haversine formula to calculate distance between two lat/lon in KM
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in km
};

const SearchModel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);

  const router = useRouter();

  // Utility function to clean empty commas from address
  const cleanAddress = (addr) => {
    return addr
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .join(", ");
  };

  // Fetch suggestions from backend API
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`/api/mappls-suggestions?query=${query}`);
      const cleanedSuggestions = (res.data.suggestedLocations || []).map(
        (loc) => ({
          ...loc,
          placeAddress: cleanAddress(loc.placeAddress),
        })
      );
      setSuggestions(cleanedSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Handle typing in the search box
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  // Handle clicking a suggestion
  const handleSelectLocation = async (loc) => {
    console.log("Selected location object:", loc);

    try {
      // Call backend API to get lat/lon
      const res = await axios.get(`/api/mappls-coords?eloc=${loc.eLoc}`);
      const coords = res.data;

      if (coords.lat && coords.lon) {
        setSelectedCoords(coords);
        setSearchTerm(loc.placeAddress);
        setSuggestions([]);
        console.log("Selected location coords:", coords.lat, coords.lon);
      } else {
        alert("Could not fetch coordinates for this location.");
      }
    } catch (err) {
      console.error("Error getting coordinates:", err);
      alert("Failed to get location details.");
    }
  };

  // Handle current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setSelectedCoords(coords);
        console.log("Current location coords:", coords);
        // Filter parking lots within 5 km
        const nearby = parkingLots.filter((lot) => {
          const distance = getDistanceKm(
            coords.lat,
            coords.lon,
            lot.lat,
            lot.lon
          );
          return distance <= 5;
        });
        console.log("Nearby parking lots:", nearby);
        setSuggestions(nearby); // reusing suggestions state for display
      },
      (err) => {
        console.error("Location error:", err);
        alert("Permission denied or error getting location");
      }
    );
  };

  return (
    <div className="md:w-[400px] w-full h-fit p-2 bg-gray-200">
      {/* Current Location Button */}
      <div className="w-full mt-2 bg-green-400 rounded-md h-[60px]">
        <button
          onClick={handleGetCurrentLocation}
          className="w-full justify-center cursor-pointer flex items-center gap-2 h-full"
        >
          Get Current Location
          <LocationEdit size={20} />
        </button>
      </div>

      {/* Debug Output */}
      {selectedCoords && (
        <p className="mt-2 text-sm text-gray-600">
          Selected Coords: {selectedCoords.lat}, {selectedCoords.lon}
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 bg-white rounded-md p-2">
          <h3 className="font-bold mb-2">Nearby Parking Lots</h3>
          {suggestions.map((lot) => (
            <div
              onClick={() =>
                router.push(`/directions?lat=${lot.lat}&lon=${lot.lon}`)
              }
              key={lot.id}
              className="border-b py-1"
            >
              {lot.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchModel;
