"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParkingStore } from "../store/useParkingStore";

const StatusScreen = ({ status, message, onRetry, onGoBack }) => {
  const renderContent = () => {
    switch (status) {
      case "no-lot":
        return (
          <>
            <div className="text-gray-400 mb-3">🚗</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No Parking Lot Selected
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Please go back and select a parking lot first.
            </p>
            <button
              onClick={onGoBack}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Go Back
            </button>
          </>
        );
      case "loading-location":
        return (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Getting your location...</p>
          </>
        );
      case "location-error":
        return (
          <>
            <div className="text-red-400 mb-3">⚠️</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Location Access Required
            </h3>
            <p className="text-gray-600 text-sm mb-4">{message}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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

const NavigationPanel = ({
  parkingLot,
  userLocation,
  isNavigating,
  startNavigation,
  stopNavigation,
  routeSummary,
}) => (
  <div className="bg-white shadow-lg border-t">
    <div className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {parkingLot.name}
          </h3>
          <p className="text-green-600 font-medium text-lg mb-2">
            {parkingLot.price}
          </p>
          <div className="text-gray-500 text-sm">
            Distance: {routeSummary?.distanceText || "Calculating..."}
          </div>
        </div>
        <div className="ml-4 text-right">
          {routeSummary && (
            <div className="text-xs text-gray-600">{routeSummary.timeText}</div>
          )}
        </div>
      </div>

      <button
        onClick={isNavigating ? stopNavigation : startNavigation}
        className={`w-full rounded-lg py-4 text-white font-medium text-lg transition-colors ${
          isNavigating
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isNavigating ? "Stop Navigation" : "Start Navigation"}
      </button>
    </div>
  </div>
);

// Load Leaflet CSS and JS from CDN (No API key required!)
const loadLeafletResources = async () => {
  // Load CSS
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }

  // Load JS
  if (!window.L && !document.getElementById("leaflet-js")) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return Promise.resolve();
};

// User location marker with direction arrow (Leaflet style)
const createUserMarker = (heading, isNavigating) => {
  const { L } = window;
  if (!L) return null;

  const color = isNavigating ? "#dc2626" : "#1E88E5";
  const showArrow = isNavigating && heading !== null;
  const size = 20;

  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${
          showArrow
            ? `
          <div style="
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 8px solid white;
            transform: rotate(${heading}deg);
            position: absolute;
          "></div>
        `
            : ""
        }
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Parking marker (Leaflet style)
const createParkingMarker = () => {
  const { L } = window;
  if (!L) return null;

  return L.divIcon({
    className: "parking-marker",
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: #10B981;
        color: #fff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        border: 2px solid white;
      ">P</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

// Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get route from OSRM API
const getRoute = async (startLng, startLat, endLng, endLat) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&overview=full`
    );
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = route.distance / 1000;
      const durationMin = route.duration / 60;

      return {
        geometry: route.geometry,
        distance:
          distanceKm >= 1
            ? `${distanceKm.toFixed(1)} km`
            : `${Math.round(route.distance)} m`,
        duration: `${Math.round(durationMin)} min`,
      };
    }
  } catch (error) {
    console.error("Error fetching route:", error);
  }
  return null;
};

const DirectionsPage = () => {
  const { selectedLot } = useParkingStore();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const [parkingLot, setParkingLot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeSummary, setRouteSummary] = useState(null);
  const [userHeading, setUserHeading] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Save/load selected lot
  useEffect(() => {
    if (selectedLot) {
      setParkingLot(selectedLot);
      localStorage.setItem("selectedParkingLot", JSON.stringify(selectedLot));
    } else {
      const saved = localStorage.getItem("selectedParkingLot");
      if (saved) setParkingLot(JSON.parse(saved));
    }
  }, [selectedLot]);

  // Get initial location
  useEffect(() => {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10,
        };
        setUserLocation(location);
        setIsLoadingLocation(false);
      },
      (err) => {
        let msg = "Unable to get location";
        if (err.code === err.PERMISSION_DENIED)
          msg = "Location permission denied";
        else if (err.code === err.TIMEOUT) msg = "Location request timed out";
        setLocationError(msg);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // Initialize map when we have both locations
  useEffect(() => {
    if (!parkingLot || !userLocation || typeof window === "undefined") return;
    if (mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        await loadLeafletResources();

        const { L } = window;

        // Calculate center point
        const centerLat = (userLocation.lat + parkingLot.lat) / 2;
        const centerLng = (userLocation.lon + parkingLot.lon) / 2;

        // Create map with OpenStreetMap tiles (no API key needed!)
        const map = L.map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true,
        });

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsMapLoaded(true);

        // Add user marker
        const userIcon = createUserMarker(userHeading, isNavigating);
        const userMarker = L.marker([userLocation.lat, userLocation.lon], {
          icon: userIcon,
        }).addTo(map);
        userMarkerRef.current = userMarker;

        // Add parking marker
        const parkingIcon = createParkingMarker();
        const parkingMarker = L.marker([parkingLot.lat, parkingLot.lon], {
          icon: parkingIcon,
        }).addTo(map);

        // Get and display route
        const route = await getRoute(
          userLocation.lon,
          userLocation.lat,
          parkingLot.lon,
          parkingLot.lat
        );

        if (route) {
          // Add route as polyline
          const routeLine = L.polyline(
            route.geometry.coordinates.map((coord) => [coord[1], coord[0]]), // Flip lng,lat to lat,lng
            {
              color: "#2563eb",
              weight: 5,
              opacity: 0.8,
            }
          ).addTo(map);

          routeLayerRef.current = routeLine;

          setRouteSummary({
            distanceText: route.distance,
            timeText: route.duration,
          });
        } else {
          // Fallback distance calculation
          const dist = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            parkingLot.lat,
            parkingLot.lon
          );
          setRouteSummary({
            distanceText:
              dist >= 1
                ? `${dist.toFixed(1)} km`
                : `${Math.round(dist * 1000)} m`,
            timeText: `${Math.round(dist * 12)} min`,
          });
        }

        // Fit bounds to show both markers
        const group = L.featureGroup([userMarker, parkingMarker]);
        if (routeLayerRef.current) {
          group.addLayer(routeLayerRef.current);
        }
        map.fitBounds(group.getBounds().pad(0.1));
      } catch (error) {
        console.error("Error initializing map:", error);
        setIsMapLoaded(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error removing map", e);
        }
        mapInstanceRef.current = null;
        userMarkerRef.current = null;
        routeLayerRef.current = null;
      }
    };
  }, [parkingLot, userLocation]);

  // Update location during navigation with throttling
  const updateUserLocation = useCallback(
    (newLocation, heading = null) => {
      const now = Date.now();

      // Throttle updates to prevent flickering (max 1 update per 3 seconds)
      if (now - lastUpdateRef.current < 3000) {
        return;
      }
      lastUpdateRef.current = now;

      setUserLocation(newLocation);
      if (heading !== null) {
        setUserHeading(heading);
      }

      // Update marker position and style
      if (userMarkerRef.current && mapInstanceRef.current) {
        const { L } = window;

        // Update position
        userMarkerRef.current.setLatLng([newLocation.lat, newLocation.lon]);

        // Update marker icon with new heading
        const newIcon = createUserMarker(heading, isNavigating);
        if (newIcon) {
          userMarkerRef.current.setIcon(newIcon);
        }
      }

      // Follow user during navigation
      if (isNavigating && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(
          [newLocation.lat, newLocation.lon],
          Math.max(mapInstanceRef.current.getZoom(), 16),
          { duration: 1 }
        );
      }
    },
    [isNavigating]
  );

  // Navigation control
  const startNavigation = useCallback(async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setIsNavigating(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        let heading = null;

        // Use device compass if available
        if (pos.coords.heading !== null && pos.coords.heading !== undefined) {
          heading = pos.coords.heading;
        } else if (userLocation) {
          // Calculate bearing from movement
          const lat1 = (userLocation.lat * Math.PI) / 180;
          const lat2 = (pos.coords.latitude * Math.PI) / 180;
          const deltaLon =
            ((pos.coords.longitude - userLocation.lon) * Math.PI) / 180;

          const y = Math.sin(deltaLon) * Math.cos(lat2);
          const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

          heading = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
        }

        updateUserLocation(
          {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy || 10,
          },
          heading
        );
      },
      (err) => {
        console.error("Watch position error", err);
        stopNavigation();
      },
      options
    );
  }, [updateUserLocation, userLocation]);

  const stopNavigation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setUserHeading(null);
  }, []);

  if (!parkingLot)
    return (
      <StatusScreen status="no-lot" onGoBack={() => window.history.back()} />
    );
  if (isLoadingLocation) return <StatusScreen status="loading-location" />;
  if (locationError)
    return (
      <StatusScreen
        status="location-error"
        message={locationError}
        onRetry={() => window.location.reload()}
      />
    );

  return (
    <div className="w-full h-[100vh] flex-col flex">
      <div className="flex-1 relative">
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: 420 }}
        />

        {!isMapLoaded && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-[1000]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      <NavigationPanel
        parkingLot={parkingLot}
        userLocation={userLocation}
        isNavigating={isNavigating}
        startNavigation={startNavigation}
        stopNavigation={stopNavigation}
        routeSummary={routeSummary}
      />
    </div>
  );
};

export default DirectionsPage;
