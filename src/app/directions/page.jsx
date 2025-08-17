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

// Helper: load external script safely
const loadExternal = (() => {
  const cache = {};
  return (url, id) =>
    new Promise((resolve, reject) => {
      if (cache[url]) return resolve(cache[url]);
      if (document.getElementById(id)) return resolve(true);
      const script = document.createElement("script");
      script.id = id;
      script.src = url;
      script.async = true;
      script.onload = () => {
        cache[url] = true;
        resolve(true);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
})();

const loadCssOnce = (href, id) => {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

// Create user location marker with direction arrow
const createUserCircleMarker = (isNavigating = false, heading = null) => {
  const { L } = window;
  if (!L) return null;

  const color = isNavigating ? "#dc2626" : "#1E88E5";
  const size = 20;

  // Show arrow when navigating and we have heading
  const showArrow = isNavigating && heading !== null;

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

const DirectionsPage = () => {
  const { selectedLot } = useParkingStore();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routingControlRef = useRef(null);
  const watchIdRef = useRef(null);

  const [parkingLot, setParkingLot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeSummary, setRouteSummary] = useState(null);
  const [userHeading, setUserHeading] = useState(null);
  const lastUpdateRef = useRef(0);

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
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10,
        });
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

  // Initialize map
  useEffect(() => {
    if (!parkingLot || !userLocation || typeof window === "undefined") return;
    if (mapInstanceRef.current) return;

    const init = async () => {
      setIsLoadingMap(true);
      try {
        loadCssOnce(
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
          "leaflet-css"
        );
        await loadExternal(
          "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
          "leaflet-js"
        );
        loadCssOnce(
          "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css",
          "lrm-css"
        );
        await loadExternal(
          "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js",
          "lrm-js"
        );

        const { L } = window;

        // Create map
        const centerLat = (userLocation.lat + parkingLot.lat) / 2;
        const centerLon = (userLocation.lon + parkingLot.lon) / 2;
        const map = L.map(mapRef.current, {
          center: [centerLat, centerLon],
          zoom: 13,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        mapInstanceRef.current = map;

        // User marker
        const userIcon = createUserCircleMarker(false, null);
        const userMarker = L.marker([userLocation.lat, userLocation.lon], {
          icon: userIcon,
        }).addTo(map);
        userMarkerRef.current = userMarker;

        // Parking marker
        const parkingIcon = L.divIcon({
          className: "custom-parking-marker",
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
        L.marker([parkingLot.lat, parkingLot.lon], {
          icon: parkingIcon,
        }).addTo(map);

        // Add routing
        const routing = L.Routing.control({
          waypoints: [
            L.latLng(userLocation.lat, userLocation.lon),
            L.latLng(parkingLot.lat, parkingLot.lon),
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null,
          lineOptions: {
            styles: [{ color: "#2563eb", weight: 5, opacity: 0.8 }],
          },
          show: false,
        }).addTo(map);

        routing.on("routesfound", (e) => {
          const routes = e.routes || [];
          if (routes.length) {
            const r = routes[0];
            const distMeters = r.summary.totalDistance || 0;
            const timeSec = r.summary.totalTime || 0;
            const distanceText =
              distMeters >= 1000
                ? `${(distMeters / 1000).toFixed(1)} km`
                : `${Math.round(distMeters)} m`;
            const timeText = `${Math.round(timeSec / 60)} min`;
            setRouteSummary({ distanceText, timeText });
          }
        });
        routingControlRef.current = routing;

        // Fit bounds
        const group = new L.featureGroup([userMarker]);
        map.fitBounds(group.getBounds().pad(0.12));

        setIsLoadingMap(false);
      } catch (err) {
        console.error("Map load error", err);
        setIsLoadingMap(false);
      }
    };
    init();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error removing map", e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [parkingLot, userLocation]);

  // Update location during navigation with throttling
  const updateUserLocation = useCallback(
    (newLocation, heading = null) => {
      const now = Date.now();

      // Throttle updates to prevent flickering (max 1 update per 2 seconds)
      if (now - lastUpdateRef.current < 2000) {
        return;
      }
      lastUpdateRef.current = now;

      setUserLocation(newLocation);
      if (heading !== null) {
        setUserHeading(heading);
      }

      if (userMarkerRef.current && mapInstanceRef.current) {
        // Smooth marker update
        userMarkerRef.current.setLatLng([newLocation.lat, newLocation.lon]);

        // Only pan map during navigation, not recalculate route constantly
        if (isNavigating) {
          mapInstanceRef.current.panTo([newLocation.lat, newLocation.lon], {
            animate: true,
            duration: 1,
          });
        }
      }
    },
    [isNavigating]
  );

  // Update marker style when navigation state changes
  useEffect(() => {
    if (!userMarkerRef.current) return;

    const newIcon = createUserCircleMarker(isNavigating, userHeading);
    if (newIcon) {
      userMarkerRef.current.setIcon(newIcon);
    }
  }, [isNavigating, userHeading]);

  // Navigation control
  const startNavigation = useCallback(async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setIsNavigating(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000, // Allow slightly cached positions to reduce updates
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        // Calculate heading/bearing if we have a previous position
        let heading = null;
        if (userLocation && pos.coords.heading !== null) {
          heading = pos.coords.heading; // Use device compass if available
        } else if (userLocation) {
          // Calculate bearing from previous position
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
    setUserHeading(null); // Reset heading when stopping
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

        {isLoadingMap && (
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
