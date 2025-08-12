"use client";
import React, { useEffect, useRef, useState } from "react";
// Assuming useParkingStore is in the same directory structure
import { useParkingStore } from "../store/useParkingStore";

// --- New Components ---
// These components remain unchanged from the previous version.

/**
 * Renders various status screens for loading and errors.
 * @param {object} props - Component props.
 * @param {string} props.status - The current status ('no-lot', 'loading-location', 'location-error').
 * @param {string} [props.message] - An optional message to display for the error.
 * @param {Function} [props.onRetry] - Function to call on retry.
 * @param {Function} [props.onGoBack] - Function to call to go back.
 */
const StatusScreen = ({ status, message, onRetry, onGoBack }) => {
  const renderContent = () => {
    switch (status) {
      case "no-lot":
        return (
          <>
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
              onClick={onGoBack}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
          </>
        );
      case "loading-location":
        return (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Getting your location...</p>
          </>
        );
      case "location-error":
        return (
          <>
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
            <p className="text-gray-600 text-sm mb-4">{message}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">{renderContent()}</div>
    </div>
  );
};

/**
 * Displays parking lot information and navigation buttons.
 * @param {object} props - Component props.
 * @param {object} props.parkingLot - The selected parking lot data.
 * @param {object} props.userLocation - The user's current location.
 * @param {boolean} props.isNavigating - State of navigation.
 * @param {Function} props.startNavigation - Function to start navigation.
 * @param {Function} props.stopNavigation - Function to stop navigation.
 */
const NavigationPanel = ({
  parkingLot,
  userLocation,
  isNavigating,
  startNavigation,
  stopNavigation,
}) => (
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
            From: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={isNavigating ? stopNavigation : startNavigation}
          className={`w-full rounded-lg py-4 text-white font-medium text-lg shadow-sm transition-colors ${
            isNavigating
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isNavigating ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10l2 2 4-4"
                />
              </svg>
              Stop Navigation
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Start Navigation
            </span>
          )}
        </button>
      </div>
    </div>
  </div>
);

// --- Refactored Main Component with orientation tracking ---
const DirectionsPage = () => {
  const { selectedLot } = useParkingStore();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const watchIdRef = useRef(null);
  const orientationWatchIdRef = useRef(null);
  const mapCreated = useRef(false); // New ref to prevent re-initialization

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [parkingLot, setParkingLot] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);

  // Load parking lot data from store or local storage
  useEffect(() => {
    if (selectedLot) {
      setParkingLot(selectedLot);
      localStorage.setItem("selectedParkingLot", JSON.stringify(selectedLot));
    } else {
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

  // Get user's initial location
  useEffect(() => {
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
        maximumAge: 300000,
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
    getCurrentLocation();
  }, []);

  // Device orientation handling
  useEffect(() => {
    const requestOrientationPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        DeviceOrientationEvent.requestPermission
      ) {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === "granted") {
            return true;
          }
        } catch (error) {
          console.log("Orientation permission request failed:", error);
        }
        return false;
      }
      return true; // For non-iOS devices or older browsers
    };

    const handleOrientation = (event) => {
      let heading = event.alpha || 0;

      // For iOS devices, use webkitCompassHeading if available
      if (event.webkitCompassHeading) {
        heading = event.webkitCompassHeading;
      } else {
        // Convert alpha to compass heading for Android
        heading = 360 - heading;
      }

      setDeviceHeading(heading);

      // Update user marker rotation if navigating
      if (isNavigating && userMarkerRef.current) {
        updateUserMarkerIcon(heading);
      }
    };

    if (isNavigating) {
      requestOrientationPermission().then((granted) => {
        if (granted) {
          window.addEventListener(
            "deviceorientationabsolute",
            handleOrientation
          );
          // Fallback for devices that don't support deviceorientationabsolute
          window.addEventListener("deviceorientation", handleOrientation);
        }
      });
    }

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation
      );
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isNavigating]);

  // Function to create user marker icon with rotation
  const createUserMarkerIcon = (heading = 0, isNavigationMode = false) => {
    const { L } = window;
    if (!L) return null;

    if (isNavigationMode) {
      // Navigation mode: directional arrow
      return L.divIcon({
        className: "custom-user-marker-navigation",
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            position: relative;
            transform: rotate(${heading}deg);
            transition: transform 0.3s ease;
          ">
            <div style="
              width: 0; 
              height: 0; 
              border-left: 12px solid transparent; 
              border-right: 12px solid transparent; 
              border-bottom: 20px solid #4285F4; 
              position: absolute;
              top: 2px;
              left: 0;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            "></div>
            <div style="
              width: 8px; 
              height: 8px; 
              background: white; 
              border-radius: 50%; 
              position: absolute;
              top: 8px;
              left: 8px;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
    } else {
      // Normal mode: pulsing dot
      return L.divIcon({
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
            animation: pulse 2s infinite;
          "></div>
          <style>
            @keyframes pulse { 
              0% { transform: scale(1); } 
              50% { transform: scale(1.2); } 
              100% { transform: scale(1); } 
            }
          </style>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
    }
  };

  // Function to update user marker icon
  const updateUserMarkerIcon = (heading = 0) => {
    if (userMarkerRef.current && window.L) {
      const newIcon = createUserMarkerIcon(heading, isNavigating);
      if (newIcon) {
        userMarkerRef.current.setIcon(newIcon);
      }
    }
  };

  // Map initialization and cleanup
  useEffect(() => {
    if (!mapRef.current || !parkingLot || !userLocation || mapCreated.current)
      return;

    setIsLoadingMap(true);
    mapCreated.current = true; // Set flag to prevent re-initialization

    // Load Leaflet and Leaflet Routing Machine scripts
    const loadScript = (url, id, globalVar) =>
      new Promise((resolve, reject) => {
        if (
          document.getElementById(id) ||
          (window[globalVar] && (!id.includes("routing") || window.L.Routing))
        ) {
          return resolve();
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

    const loadCss = (url, id) => {
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      }
    };

    const initializeMap = async () => {
      try {
        loadCss(
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
          "leaflet-css"
        );
        await loadScript(
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
          "leaflet-js",
          "L"
        );

        loadCss(
          "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css",
          "routing-css"
        );
        await loadScript(
          "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js",
          "routing-js",
          "L.Routing"
        );

        const { L } = window;
        if (!L || !L.Routing) {
          throw new Error("Leaflet or Leaflet Routing Machine not loaded.");
        }

        const centerLat = (userLocation.lat + parkingLot.lat) / 2;
        const centerLon = (userLocation.lon + parkingLot.lon) / 2;

        const map = L.map(mapRef.current, {
          center: [centerLat, centerLon],
          zoom: 13,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Create user icon (normal mode initially)
        const userIcon = createUserMarkerIcon(0, false);

        const parkingIcon = L.divIcon({
          className: "custom-parking-marker",
          html: `<div style="width: 30px; height: 30px; background: #10B981; border: 2px solid white; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); position: relative;">P</div><div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #10B981;"></div>`,
          iconSize: [30, 40],
          iconAnchor: [15, 40],
        });

        // Add markers
        const userMarker = L.marker([userLocation.lat, userLocation.lon], {
          icon: userIcon,
          title: "Your Location",
        }).addTo(map);
        userMarkerRef.current = userMarker;

        const parkingMarker = L.marker([parkingLot.lat, parkingLot.lon], {
          icon: parkingIcon,
          title: parkingLot.name,
        }).addTo(map);
        parkingMarker.bindPopup(
          `<div style="font-family: Arial, sans-serif;"><h3 style="margin: 0 0 8px 0; color: #1f2937;">${parkingLot.name}</h3><p style="margin: 0; color: #10b981; font-weight: bold;">${parkingLot.price}</p></div>`
        );

        // Add routing
        L.Routing.control({
          waypoints: [
            L.latLng(userLocation.lat, userLocation.lon),
            L.latLng(parkingLot.lat, parkingLot.lon),
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null,
          lineOptions: {
            styles: [{ color: "#2563eb", weight: 6, opacity: 0.8 }],
          },
          show: false,
          collapsible: true,
          router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
          }),
        }).addTo(map);

        const group = new L.featureGroup([userMarker, parkingMarker]);
        map.fitBounds(group.getBounds().pad(0.1));

        map.on("dragstart", () => setIsFollowingUser(false));
        setIsLoadingMap(false);
      } catch (error) {
        console.error("Error initializing map:", error);
        mapCreated.current = false;
        // Optionally, set an error state here to show an error screen
      }
    };
    initializeMap();

    // Cleanup function
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          mapCreated.current = false;
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, [parkingLot, userLocation]);

  // Update marker icon when navigation state changes
  useEffect(() => {
    if (userMarkerRef.current) {
      updateUserMarkerIcon(deviceHeading);
    }
  }, [isNavigating, deviceHeading]);

  const startNavigation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    // Request orientation permission for iOS devices
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      DeviceOrientationEvent.requestPermission
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") {
          console.log("Device orientation permission denied");
        }
      } catch (error) {
        console.log("Error requesting orientation permission:", error);
      }
    }

    setIsNavigating(true);
    setIsFollowingUser(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lon: longitude };
        setUserLocation(newLocation);

        if (userMarkerRef.current && mapInstanceRef.current) {
          // Update marker position with smooth animation
          userMarkerRef.current.setLatLng([latitude, longitude]);

          if (isFollowingUser) {
            // Smooth pan to new location
            mapInstanceRef.current.panTo([latitude, longitude]);
          }
        }
      },
      (error) => {
        console.error("Error watching position:", error);
        setIsNavigating(false);
      },
      options
    );
  };

  const stopNavigation = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setIsFollowingUser(false);

    // Reset marker to normal mode
    if (userMarkerRef.current) {
      updateUserMarkerIcon(0);
    }
  };

  const centerOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lon], 16);
      setIsFollowingUser(true);
    }
  };

  if (!parkingLot) {
    return (
      <StatusScreen status="no-lot" onGoBack={() => window.history.back()} />
    );
  }
  if (isLoadingLocation) {
    return <StatusScreen status="loading-location" />;
  }
  if (locationError) {
    return (
      <StatusScreen
        status="location-error"
        message={locationError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="w-full h-[100vh] flex-col flex">
      {/* Map Section */}
      <div className="flex-1 relative">
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: "400px" }}
        />
        <div className="absolute top-4 right-4 z-[1000] space-y-2">
          <button
            onClick={centerOnUser}
            className={`p-3 rounded-full shadow-lg transition-all ${
              isFollowingUser
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            title="Center on current location"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2L12 6M12 18L12 22M4.22 4.22L6.34 6.34M17.66 6.34L19.78 4.22M2 12L6 12M18 12L22 12M4.22 19.78L6.34 17.66M17.66 17.66L19.78 19.78"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        {isLoadingMap && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Panel */}
      <NavigationPanel
        parkingLot={parkingLot}
        userLocation={userLocation}
        isNavigating={isNavigating}
        startNavigation={startNavigation}
        stopNavigation={stopNavigation}
      />
    </div>
  );
};

export default DirectionsPage;
