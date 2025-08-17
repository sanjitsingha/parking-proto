"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParkingStore } from "../store/useParkingStore";

// (StatusScreen and NavigationPanel components remain the same)
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

const loadLeafletResources = async () => {
  if (typeof window === "undefined") return;

  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }

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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
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
        distanceText:
          distanceKm >= 1
            ? `${distanceKm.toFixed(1)} km`
            : `${Math.round(route.distance)} m`,
        timeText: `${Math.round(durationMin)} min`,
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

  const [parkingLot, setParkingLot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeSummary, setRouteSummary] = useState(null);
  const [userHeading, setUserHeading] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Load selected lot from store or local storage
  useEffect(() => {
    if (selectedLot) {
      setParkingLot(selectedLot);
      localStorage.setItem("selectedParkingLot", JSON.stringify(selectedLot));
    } else {
      const saved = localStorage.getItem("selectedParkingLot");
      if (saved) setParkingLot(JSON.parse(saved));
    }
  }, [selectedLot]);

  // Initial location fetch
  useEffect(() => {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setIsLoadingLocation(false);
      return;
    }
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    };
    const handleSuccess = (pos) => {
      const location = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy || 10,
      };
      setUserLocation(location);
      setIsLoadingLocation(false);
    };
    const handleError = (err) => {
      let msg = "Unable to get location";
      if (err.code === err.PERMISSION_DENIED)
        msg = "Location permission denied";
      else if (err.code === err.TIMEOUT) msg = "Location request timed out";
      setLocationError(msg);
      setIsLoadingLocation(false);
    };
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );
  }, []);

  // Map initialization and cleanup
  useEffect(() => {
    if (!parkingLot || !userLocation || typeof window === "undefined") return;
    if (mapInstanceRef.current) return;

    let mounted = true;
    const initMap = async () => {
      try {
        await loadLeafletResources();
        if (!mounted || !window.L) return;

        const { L } = window;
        const centerLat = (userLocation.lat + parkingLot.lat) / 2;
        const centerLng = (userLocation.lon + parkingLot.lon) / 2;

        const map = L.map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "©Parking Sliguri",
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsMapLoaded(true);

        const parkingIcon = createParkingMarker();
        L.marker([parkingLot.lat, parkingLot.lon], { icon: parkingIcon }).addTo(
          map
        );

        const route = await getRoute(
          userLocation.lon,
          userLocation.lat,
          parkingLot.lon,
          parkingLot.lat
        );

        if (route) {
          const routeLine = L.polyline(
            route.geometry.coordinates.map((coord) => [coord[1], coord[0]]),
            { color: "#2563eb", weight: 5, opacity: 0.8 }
          ).addTo(map);
          routeLayerRef.current = routeLine;
          setRouteSummary({
            distanceText: route.distanceText,
            timeText: route.timeText,
          });
        } else {
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
      } catch (error) {
        console.error("Error initializing map:", error);
        if (mounted) setIsMapLoaded(false);
      }
    };
    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        userMarkerRef.current = null;
        routeLayerRef.current = null;
      }
    };
  }, [parkingLot, userLocation]);

  // Update user marker and map view
  useEffect(() => {
    if (mapInstanceRef.current && userLocation) {
      const { L } = window;
      if (!userMarkerRef.current) {
        const userIcon = createUserMarker(userHeading, isNavigating);
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lon], {
          icon: userIcon,
        }).addTo(mapInstanceRef.current);
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lon]);
        const newIcon = createUserMarker(userHeading, isNavigating);
        if (newIcon) {
          userMarkerRef.current.setIcon(newIcon);
        }
      }

      // Fit bounds when markers are first added
      if (!isNavigating && mapInstanceRef.current && routeLayerRef.current) {
        const group = L.featureGroup([
          userMarkerRef.current,
          L.marker([parkingLot.lat, parkingLot.lon]),
          routeLayerRef.current,
        ]);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [userLocation, userHeading, isNavigating, parkingLot]);

  // --- Solution: Define functions before use and use a single useCallback for navigation control ---
  const stopNavigation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setUserHeading(null);
  }, []);

  const startNavigation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    };
    setIsNavigating(true);

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10,
        };
        const heading =
          pos.coords.heading !== null && pos.coords.heading !== undefined
            ? pos.coords.heading
            : userLocation
            ? ((Math.atan2(
                Math.sin(
                  ((pos.coords.longitude - userLocation.lon) * Math.PI) / 180
                ) * Math.cos((pos.coords.latitude * Math.PI) / 180),
                Math.cos((userLocation.lat * Math.PI) / 180) *
                  Math.sin((pos.coords.latitude * Math.PI) / 180) -
                  Math.sin((userLocation.lat * Math.PI) / 180) *
                    Math.cos((pos.coords.latitude * Math.PI) / 180) *
                    Math.cos(
                      ((pos.coords.longitude - userLocation.lon) * Math.PI) /
                        180
                    )
              ) *
                180) /
                Math.PI +
                360) %
              360
            : null;

        setUserLocation(newLocation);
        setUserHeading(heading);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(
            [newLocation.lat, newLocation.lon],
            Math.max(mapInstanceRef.current.getZoom(), 17),
            { duration: 1 }
          );
        }
      },
      (err) => {
        console.error("Watch position error", err);
        // Call the stable stopNavigation function
        stopNavigation();
      },
      options
    );
  }, [userLocation, stopNavigation]); // Dependencies are crucial here

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopNavigation();
    };
  }, [stopNavigation]);

  // (The rest of the component's JSX remains the same)
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
