"use client";
import { MapPin, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import CurrentLocationParking from "../app/_components/CurrentLocationParking";

const page = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // 🔹 Fetch location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        setLoadingSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching location suggestions:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 400); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  // 🔹 Handle selecting a suggestion
  const handleSelect = (place) => {
    setQuery(place.display_name);
    setSelectedLocation({
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      name: place.display_name,
    });
    setSuggestions([]);
    setInputFocused(false);
  };

  // 🔹 Handle clearing search
  const handleClearSearch = () => {
    setQuery("");
    setSelectedLocation(null);
    setSuggestions([]);
  };

  return (
    <div className="font-inter h-[100vh]">
      <div className="w-full h-[calc(100vh-90px)] overflow-y-auto">
        {/* Header */}
        <div className="w-full h-fit pt-4 pb-6 px-4 bg-[#18191F] transition-all duration-300">
          <div className="w-full text-white font-inter">
            <p className="text-sm">Wherever you go</p>
            <p className="text-yellow text-[22px] font-semibold">
              {" "}
              Parking follows!
            </p>
          </div>

          {/* Address section - hidden initially */}
          {selectedLocation && (
            <div className="mt-2 w-full flex gap-1 items-center">
              <MapPin size={12} className="text-yellow-400" />
              <p className="text-xs text-yellow-400 truncate max-w-[80%]">
                {selectedLocation.name}
              </p>
            </div>
          )}
        </div>

        {/* Sticky Search Bar */}
        <div className="w-full sticky top-0 z-10 bg-[#18191F] p-4 pt-2">
          <div className="flex flex-col gap-2 relative">
            <div className="flex gap-2 items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 200)}
                className="bg-yellow/10 text-white flex-1 border-yellow-400 border outline-none px-3 h-[46px] rounded-md text-sm"
                type="text"
                placeholder="Search for a location..."
              />

              {/* 🔸 Dynamic Button (Go / Clear) */}
              {selectedLocation ? (
                <button
                  onClick={handleClearSearch}
                  className="h-[46px] w-[46px] flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 transition-all"
                >
                  <X className="text-white" size={20} />
                </button>
              ) : (
                <button
                  onClick={() => console.log("Searching:", query)}
                  className="h-[46px] rounded-md px-4 bg-yellow-400 font-medium"
                >
                  Go
                </button>
              )}
            </div>

            {/* Suggestions or shimmer */}
            {inputFocused && (
              <div className="absolute top-[48px] left-0 w-full bg-white shadow-lg rounded-md max-h-[250px] overflow-y-auto z-50 animate-fadeIn">
                {loadingSuggestions ? (
                  // 🔸 Shimmer Loading Effect
                  <div className="p-3 space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-200 rounded-md animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((place, i) => (
                      <li
                        key={i}
                        onClick={() => handleSelect(place)}
                        className="px-3 py-3 hover:bg-yellow-100 border-b border-black/10 cursor-pointer text-sm text-gray-800"
                      >
                        {place.display_name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  query.length >= 3 && (
                    <div className="p-3 text-gray-500 text-sm text-center">
                      No results found
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Parking Cards Section */}
        {selectedLocation ? (
          <CurrentLocationParking
            lat={selectedLocation.lat}
            lon={selectedLocation.lon}
            radius={3} // 3 km for search
          />
        ) : (
          <CurrentLocationParking radius={1} /> // default 1 km for current location
        )}
      </div>
    </div>
  );
};

export default page;
