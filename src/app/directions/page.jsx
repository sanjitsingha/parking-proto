"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParkingStore } from "../store/useParkingStore";

const DirectionsPage = () => {
  const { selectedLot } = useParkingStore();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Try to get parking lot data from localStorage as fallback
  const [parkingLot, setParkingLot] = useState(null);

  useEffect(() => {
    // Check if we have selectedLot from store, otherwise check localStorage
    if (selectedLot) {
      setParkingLot(selectedLot);
      // Save to localStorage for persistence
      localStorage.setItem("selectedParkingLot", JSON.stringify(selectedLot));
    } else {
      // Try to get from localStorage
      try {
        const savedLot = localStorage.getItem("selectedParkingLot");
        if (savedLot) {
          setParkingLot(JSON.parse(savedLot));
        }
      } catch (error) {
        console.error("Error reading parking lot from localStorage:", error);
      }
    }
  }, [selectedLot]);

  useEffect(() => {
    // Get current location
    const getCurrentLocation = () => {
      setIsLoadingLocation(true);
      setLocationError(null);

      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by this browser");
        setIsLoadingLocation(false);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setIsLoadingLocation(false);
        },
        (error) => {
          let errorMessage = "Unable to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location permissions.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }

          setLocationError(errorMessage);
          setIsLoadingLocation(false);
        },
        options
      );
    };

    // Get location on component mount
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!userLocation || !parkingLot) return;
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    };

    // Load Leaflet Routing Machine
    const loadRoutingMachine = () => {
      if (!document.getElementById("routing-css")) {
        const link = document.createElement("link");
        link.id = "routing-css";
        link.rel = "stylesheet";
        link.href =
          "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css";
        document.head.appendChild(link);
      }

      if (!window.L || !window.L.Routing) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    };

    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        // Load dependencies
        await loadLeaflet();
        await loadRoutingMachine();

        // Hide loading overlay
        const loadingElement = document.getElementById("map-loading");
        if (loadingElement) {
          loadingElement.style.display = "none";
        }

        // Calculate center point
        const centerLat = (userLocation.lat + parkingLot.lat) / 2;
        const centerLon = (userLocation.lon + parkingLot.lon) / 2;

        // Initialize map
        const map = window.L.map(mapRef.current).setView(
          [centerLat, centerLon],
          13
        );

        // Add OpenStreetMap tiles
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          }
        ).addTo(map);

        mapInstanceRef.current = map;

        // Custom icons
        const userIcon = window.L.divIcon({
          className: "custom-user-marker",
          html: `
            <div style="
              width: 20px; 
              height: 20px; 
              background: #4285F4; 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              position: relative;
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const parkingIcon = window.L.divIcon({
          className: "custom-parking-marker",
          html: `
            <div style="
              width: 30px; 
              height: 30px; 
              background: #10B981; 
              border: 2px solid white; 
              border-radius: 6px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 16px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              position: relative;
            ">P</div>
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 8px solid #10B981;
            "></div>
          `,
          iconSize: [30, 40],
          iconAnchor: [15, 40],
        });

        // Add markers
        const userMarker = window.L.marker(
          [userLocation.lat, userLocation.lon],
          {
            icon: userIcon,
            title: "Your Location",
          }
        ).addTo(map);

        const parkingMarker = window.L.marker(
          [parkingLot.lat, parkingLot.lon],
          {
            icon: parkingIcon,
            title: parkingLot.name,
          }
        ).addTo(map);

        // Add popup to parking marker
        parkingMarker.bindPopup(`
          <div style="font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937;">${parkingLot.name}</h3>
            <p style="margin: 0; color: #10b981; font-weight: bold;">${parkingLot.price}</p>
          </div>
        `);

        // Add routing
        const routingControl = window.L.Routing.control({
          waypoints: [
            window.L.latLng(userLocation.lat, userLocation.lon),
            window.L.latLng(parkingLot.lat, parkingLot.lon),
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: function () {
            return null;
          }, // Don't create default markers
          lineOptions: {
            styles: [
              {
                color: "#2563eb",
                weight: 6,
                opacity: 0.8,
              },
            ],
          },
          show: false, // Hide the routing panel
          collapsible: true,
          router: window.L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
          }),
        }).addTo(map);

        // Fit bounds to show the route
        const group = new window.L.featureGroup([userMarker, parkingMarker]);
        map.fitBounds(group.getBounds().pad(0.1));

        // Handle routing events
        routingControl.on("routesfound", function (e) {
          const routes = e.routes;
          const summary = routes[0].summary;
          console.log("Route found:", {
            distance:
              Math.round((summary.totalDistance / 1000) * 10) / 10 + " km",
            time: Math.round(summary.totalTime / 60) + " min",
          });
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        // Show error message
        const loadingElement = document.getElementById("map-loading");
        if (loadingElement) {
          loadingElement.innerHTML = `
            <div class="text-center">
              <p class="text-red-600 text-sm">Error loading map</p>
              <button onclick="location.reload()" class="text-blue-600 text-sm underline mt-2">Retry</button>
            </div>
          `;
        }
      }
    };

    if (parkingLot && userLocation) {
      initializeMap();
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, [parkingLot, userLocation]);

  // Handle different loading and error states
  if (!parkingLot) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No Parking Lot Selected
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Please go back and select a parking lot first.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingLocation) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Location Access Required
          </h3>
          <p className="text-gray-600 text-sm mb-4">{locationError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500">Unable to get your location</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] flex-col flex">
      <div className="flex-1 relative">
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: "400px" }}
        />

        {/* Loading overlay */}
        <div
          className="absolute inset-0 bg-white flex items-center justify-center z-[1000]"
          id="map-loading"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg border-t">
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {parkingLot.name}
              </h2>
              <p className="text-green-600 font-medium text-lg mb-2">
                {parkingLot.price}
              </p>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Destination: {parkingLot.lat.toFixed(4)},{" "}
                {parkingLot.lon.toFixed(4)}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                From: {userLocation.lat.toFixed(4)},{" "}
                {userLocation.lon.toFixed(4)}
              </div>
            </div>
          </div>

          <button className="w-full rounded-lg bg-green-500 hover:bg-green-600 transition-colors py-4 text-white font-medium text-lg shadow-sm">
            Generate QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectionsPage;
