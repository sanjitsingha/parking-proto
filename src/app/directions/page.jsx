"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParkingStore } from "../store/useParkingStore";

/**
 * Enhanced DirectionsPage with smooth movement and Google Maps-like accuracy circle
 */

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
  toggleFollow,
  isFollowingUser,
  onParkingLotClick,
}) => (
  <div className="bg-white shadow-lg border-t">
    <div className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <button
            onClick={onParkingLotClick}
            className="text-xl font-semibold text-blue-600 mb-1 hover:text-blue-800 transition-colors text-left"
          >
            {parkingLot.name} →
          </button>
          <p className="text-green-600 font-medium text-lg mb-2">
            {parkingLot.price}
          </p>
          <div className="text-gray-500 text-sm mb-1">
            Dest: {parkingLot.lat.toFixed(4)}, {parkingLot.lon.toFixed(4)}
          </div>
          <div className="text-gray-500 text-sm">
            You: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
          </div>
        </div>
        <div className="ml-4 text-right">
          {routeSummary && (
            <div className="text-xs text-gray-600">
              {routeSummary.distanceText} • {routeSummary.timeText}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
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

        <div className="flex gap-2">
          <button
            onClick={toggleFollow}
            className={`flex-1 py-2 rounded-lg border transition-colors ${
              isFollowingUser
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isFollowingUser ? "Following" : "Follow"}
          </button>
          <button
            className="flex-1 py-2 rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.alert("Compass feature coming soon!")}
          >
            Compass
          </button>
        </div>
      </div>
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

// Create simple pulsing circle marker (Google Maps style)
const createUserCircleMarker = (isNavigating = false) => {
  const { L } = window;
  if (!L) return null;

  const color = isNavigating ? "#dc2626" : "#1E88E5"; // red when navigating, blue when not
  const size = 16;

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
        z-index: 1000;
      "></div>
      
      <div class="pulse-animation" style="
        position: absolute;
        top: 50%;
        left: 50%;
        width: ${size + 8}px;
        height: ${size + 8}px;
        transform: translate(-50%, -50%);
        border: 2px solid ${color};
        border-radius: 50%;
        opacity: 0.6;
        animation: locationPulse 2s infinite ease-out;
        z-index: 999;
      "></div>

      <style>
        @keyframes locationPulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
      </style>
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
  const accuracyCircleRef = useRef(null);
  const routingControlRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const [parkingLot, setParkingLot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [routeSummary, setRouteSummary] = useState(null);

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
    const opts = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    };
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
      opts
    );
  }, []);

  // Initialize map when we have both parkingLot and userLocation
  useEffect(() => {
    if (!parkingLot || !userLocation || typeof window === "undefined") return;
    if (mapInstanceRef.current) return; // already created

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

        // create map
        const centerLat = (userLocation.lat + parkingLot.lat) / 2;
        const centerLon = (userLocation.lon + parkingLot.lon) / 2;
        const map = L.map(mapRef.current, {
          center: [centerLat, centerLon],
          zoom: 13,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        mapInstanceRef.current = map;

        // Create accuracy circle (Google Maps style)
        const accuracyCircle = L.circle([userLocation.lat, userLocation.lon], {
          radius: userLocation.accuracy || 10,
          fillColor: isNavigating ? "#dc2626" : "#1E88E5",
          fillOpacity: 0.1,
          color: isNavigating ? "#dc2626" : "#1E88E5",
          weight: 1,
          opacity: 0.3,
        }).addTo(map);
        accuracyCircleRef.current = accuracyCircle;

        // user marker (simple circle)
        const userIcon = createUserCircleMarker(false);
        const userMarker = L.marker([userLocation.lat, userLocation.lon], {
          icon: userIcon,
          zIndexOffset: 1000,
        }).addTo(map);
        userMarkerRef.current = userMarker;

        // parking marker
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
        const pMarker = L.marker([parkingLot.lat, parkingLot.lon], {
          icon: parkingIcon,
        }).addTo(map);

        // add routing control and capture summary
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
          router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
          }),
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
            const timeText =
              timeSec >= 3600
                ? `${Math.round(timeSec / 3600)} h`
                : `${Math.round(timeSec / 60)} min`;
            setRouteSummary({ distanceText, timeText, raw: r.summary });
          }
        });
        routingControlRef.current = routing;

        // fit bounds to both markers
        const group = new L.featureGroup([userMarker, pMarker]);
        map.fitBounds(group.getBounds().pad(0.12));

        // map interactions
        map.on("dragstart", () => setIsFollowingUser(false));

        setIsLoadingMap(false);
      } catch (err) {
        console.error("Map load error", err);
        setIsLoadingMap(false);
      }
    };
    init();

    // cleanup
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error removing map", e);
        }
        mapInstanceRef.current = null;
      }
      userMarkerRef.current = null;
      accuracyCircleRef.current = null;
      routingControlRef.current = null;
    };
  }, [parkingLot, userLocation]);

  // Smooth location updates with throttling
  const updateUserLocation = useCallback(
    (newLocation) => {
      const now = Date.now();

      // Throttle updates to prevent jittery movement (max 2 updates per second)
      if (now - lastUpdateRef.current < 500) {
        return;
      }
      lastUpdateRef.current = now;

      setUserLocation(newLocation);

      if (userMarkerRef.current && mapInstanceRef.current) {
        // Smooth marker animation
        userMarkerRef.current.setLatLng([newLocation.lat, newLocation.lon]);

        // Update accuracy circle
        if (accuracyCircleRef.current) {
          accuracyCircleRef.current.setLatLng([
            newLocation.lat,
            newLocation.lon,
          ]);
          accuracyCircleRef.current.setRadius(newLocation.accuracy || 10);
        }

        // Smooth map following
        if (isFollowingUser) {
          mapInstanceRef.current.panTo([newLocation.lat, newLocation.lon], {
            animate: true,
            duration: 0.5,
            easeLinearity: 0.1,
          });
        }

        // Update route during navigation
        if (isNavigating && routingControlRef.current) {
          try {
            routingControlRef.current.setWaypoints([
              window.L.latLng(newLocation.lat, newLocation.lon),
              window.L.latLng(parkingLot.lat, parkingLot.lon),
            ]);
          } catch (e) {
            // ignore routing errors
          }
        }
      }
    },
    [isFollowingUser, isNavigating, parkingLot]
  );

  // Update marker style when navigation state changes
  useEffect(() => {
    if (!userMarkerRef.current || !accuracyCircleRef.current) return;

    // Update marker icon
    const newIcon = createUserCircleMarker(isNavigating);
    if (newIcon) {
      userMarkerRef.current.setIcon(newIcon);
    }

    // Update accuracy circle color
    const color = isNavigating ? "#dc2626" : "#1E88E5";
    accuracyCircleRef.current.setStyle({
      fillColor: color,
      color: color,
    });

    // Smooth zoom when starting navigation
    if (isNavigating && mapInstanceRef.current && userLocation) {
      const currentZoom = mapInstanceRef.current.getZoom();
      if (currentZoom < 16) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lon], 17, {
          animate: true,
          duration: 1.2,
        });
      }
    }
  }, [isNavigating, userLocation]);

  // Navigation control
  const startNavigation = useCallback(async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setIsNavigating(true);
    setIsFollowingUser(true);

    const opts = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updateUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10,
        });
      },
      (err) => {
        console.error("Watch position error", err);
        stopNavigation();
      },
      opts
    );
  }, [updateUserLocation]);

  const stopNavigation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setIsFollowingUser(false);
  }, []);

  const centerOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lon], 16, {
        animate: true,
        duration: 0.8,
      });
      setIsFollowingUser(true);
    }
  };

  const toggleFollow = () => setIsFollowingUser((v) => !v);

  const handleParkingLotClick = () => {
    // Navigate to parking lot details page
    // You can replace this with your actual routing logic
    const detailsUrl = `/parking-details/${encodeURIComponent(
      parkingLot.name
    )}`;
    window.open(detailsUrl, "_blank");
  };

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
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M2 12h4M18 12h4M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

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
        toggleFollow={toggleFollow}
        isFollowingUser={isFollowingUser}
        onParkingLotClick={handleParkingLotClick}
      />
    </div>
  );
};

export default DirectionsPage;
