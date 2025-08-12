"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParkingStore } from "../store/useParkingStore";

/**
 * Improved DirectionsPage
 * - Google-map-like user pointer (SVG teardrop) with smooth rotation
 * - Reliable device orientation handling (permission, fallback, throttling)
 * - Cleaner, modularized code and safer resource loading
 * - Small feature additions: follow toggle, compass button, route summary (distance/time)
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
          className={`w-full rounded-lg py-4 text-white font-medium text-lg ${
            isNavigating ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {isNavigating ? "Stop Navigation" : "Start Navigation"}
        </button>

        <div className="flex gap-2">
          <button
            onClick={toggleFollow}
            className={`flex-1 py-2 rounded-lg border ${
              isFollowingUser ? "bg-blue-50 border-blue-300" : "bg-white"
            }`}
          >
            {isFollowingUser ? "Following" : "Follow"}
          </button>
          <button
            className="flex-1 py-2 rounded-lg border bg-white"
            onClick={() => window.alert("Compass toggled (placeholder)")}
          >
            Compass
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Helper: load external script only once and return when ready
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

// Make a Google-maps-like SVG teardrop as a divIcon (works crisp at any zoom)
const createUserIconSvg = (heading = 0, isNavigation = false) => {
  const rotation = `transform: rotate(${heading}deg); transform-origin: 50% 60%;`;
  // When not navigating, show simple steady icon + soft pulse ring via CSS
  if (!isNavigation) {
    return `
      <div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" width="36" height="36" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#1E88E5"/>
          <circle cx="12" cy="9" r="3" fill="#ffffff"/>
        </svg>
        <style>
          @keyframes userPulse {0% {transform: scale(0.9); opacity: 1} 70% {transform: scale(1.4); opacity: 0.2} 100% {transform: scale(1.6); opacity: 0}}
          .user-pulse-ring { position: absolute; width: 50px; height: 50px; border-radius: 50%; background: rgba(30,136,229,0.12); animation: userPulse 2s infinite; }
        </style>
      </div>
    `;
  }

  // Navigation mode: teardrop + forward cone (soft gradient) + rotation controlled via container
  return `
    <div style="width:64px;height:64px;display:flex;align-items:center;justify-content:center;${rotation}">
      <svg viewBox="0 0 48 48" width="48" height="48" style="position:relative;z-index:3;filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));">
        <defs>
          <linearGradient id="gGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#1E88E5" stop-opacity="1" />
            <stop offset="100%" stop-color="#1565C0" stop-opacity="1" />
          </linearGradient>
        </defs>
        <path d="M24 4C16.3 4 10 10.3 10 18c0 7 9 20 14 24 5-4 14-17 14-24 0-7.7-6.3-14-14-14z" fill="url(#gGrad)" />
        <circle cx="24" cy="18" r="5.2" fill="#fff" />
      </svg>
      <!-- soft cone / beam (using SVG blur + gradient feel) -->
      <svg viewBox="0 0 200 200" width="120" height="120" style="position:absolute;left:50%;top:8%;transform:translateX(-50%);pointer-events:none;z-index:1;">
        <defs>
          <linearGradient id="beam" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#1E88E5" stop-opacity="0.28" />
            <stop offset="100%" stop-color="#1E88E5" stop-opacity="0.02" />
          </linearGradient>
          <filter id="blurMe" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <path d="M100 60 L60 180 L140 180 Z" fill="url(#beam)" filter="url(#blurMe)" />
      </svg>
      <style>
        @keyframes navPulse {0% {opacity: 0.85} 50% {opacity:1} 100% {opacity:0.6}}
      </style>
    </div>
  `;
};

const createDivIcon = (html, size = [48, 48], anchor = [24, 24]) => {
  const { L } = window;
  if (!L) return null;
  return L.divIcon({
    className: "custom-user-icon",
    html,
    iconSize: size,
    iconAnchor: anchor,
  });
};

const DirectionsPage = () => {
  const { selectedLot } = useParkingStore();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routingControlRef = useRef(null);

  const [parkingLot, setParkingLot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [deviceHeading, setDeviceHeading] = useState(0);
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

  // Device orientation: permission + throttled updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    let last = 0;
    let rafId = null;

    const handle = (ev) => {
      // prefer absolute heading if available
      let heading = null;
      if (ev.absolute && typeof ev.alpha === "number") heading = ev.alpha;
      if (typeof ev.webkitCompassHeading === "number")
        heading = ev.webkitCompassHeading;
      if (heading == null && typeof ev.alpha === "number")
        heading = 360 - ev.alpha; // fallback
      if (heading == null) return;

      // normalize [0,360)
      heading = (heading + 360) % 360;

      // throttle updates by angle delta and time
      const now = performance.now();
      if (Math.abs(heading - last) < 3 && now - (rafId || 0) < 80) return; // small changes ignored
      last = heading;

      // use RAF for smoother UI changes
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setDeviceHeading(heading);
        // rotate marker element directly for low-cost update
        if (userMarkerRef.current && userMarkerRef.current.getElement) {
          const el = userMarkerRef.current.getElement();
          if (el) {
            const container = el.querySelector("div"); // our top-level container
            if (container) container.style.transform = `rotate(${heading}deg)`;
          }
        }
      });
    };

    const requestPermissionAndListen = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        DeviceOrientationEvent.requestPermission
      ) {
        try {
          const perm = await DeviceOrientationEvent.requestPermission();
          if (perm === "granted") {
            window.addEventListener("deviceorientationabsolute", handle, true);
            window.addEventListener("deviceorientation", handle, true);
          } else {
            // permission denied - don't attach
            console.warn("Device orientation permission denied");
          }
        } catch (e) {
          console.warn("Orientation permission error", e);
        }
      } else {
        // non-iOS
        window.addEventListener("deviceorientationabsolute", handle, true);
        window.addEventListener("deviceorientation", handle, true);
      }
    };

    if (isNavigating) requestPermissionAndListen();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("deviceorientationabsolute", handle, true);
      window.removeEventListener("deviceorientation", handle, true);
    };
  }, [isNavigating]);

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
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);
        mapInstanceRef.current = map;

        // user marker
        const userHtml = createUserIconSvg(0, false);
        const userIcon = createDivIcon(userHtml, [48, 48], [24, 30]);
        const userMarker = L.marker([userLocation.lat, userLocation.lon], {
          icon: userIcon,
        }).addTo(map);
        userMarkerRef.current = userMarker;

        // parking marker
        const parkingIcon = L.divIcon({
          className: "custom-parking-marker",
          html: `<div style="width:36px;height:36px;background:#10B981;color:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;box-shadow:0 2px 4px rgba(0,0,0,0.2)">P</div>`,
          iconSize: [36, 42],
          iconAnchor: [18, 42],
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
            styles: [{ color: "#2563eb", weight: 6, opacity: 0.85 }],
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
            const distMeters =
              r.summary.totalDistance || r.summary.totalDistance === 0
                ? r.summary.totalDistance
                : r.summary.total_distance || 0;
            const timeSec =
              r.summary.totalTime || r.summary.totalTime === 0
                ? r.summary.totalTime
                : r.summary.total_time || 0;
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
      routingControlRef.current = null;
    };
  }, [parkingLot, userLocation]);

  // Keep marker position updated when userLocation changes
  useEffect(() => {
    if (userMarkerRef.current && userLocation) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lon]);
      if (isFollowingUser && mapInstanceRef.current) {
        mapInstanceRef.current.panTo([userLocation.lat, userLocation.lon], {
          animate: true,
          duration: 0.6,
        });
      }
      // update route waypoints when navigating
      if (isNavigating && routingControlRef.current) {
        try {
          routingControlRef.current.setWaypoints([
            window.L.latLng(userLocation.lat, userLocation.lon),
            window.L.latLng(parkingLot.lat, parkingLot.lon),
          ]);
        } catch (e) {
          /* ignore */
        }
      }
    }
  }, [userLocation]);

  // Update user marker icon when navigation toggle changes (replace icon once)
  useEffect(() => {
    if (!userMarkerRef.current || typeof window === "undefined") return;
    const html = createUserIconSvg(deviceHeading, isNavigating);
    const newIcon = createDivIcon(
      html,
      isNavigating ? [64, 64] : [48, 48],
      isNavigating ? [32, 40] : [24, 30]
    );
    if (newIcon) userMarkerRef.current.setIcon(newIcon);

    // when starting navigation, zoom-in smoothly just once
    if (isNavigating && mapInstanceRef.current) {
      const mz = mapInstanceRef.current.getZoom();
      if (mz < 16)
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lon], 17, {
          animate: true,
          duration: 1,
        });
    }
  }, [isNavigating]);

  // Geolocation watch for navigation
  const watchIdRef = useRef(null);
  const startNavigation = useCallback(async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setIsNavigating(true);
    setIsFollowingUser(true);

    const opts = { enableHighAccuracy: true, timeout: 15000, maximumAge: 500 };
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Watch position error", err);
        stopNavigation();
      },
      opts
    );
  }, []);

  const stopNavigation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setIsFollowingUser(false);
    // reset marker rotation (visual)
    if (userMarkerRef.current) {
      const el = userMarkerRef.current.getElement();
      if (el) {
        const container = el.querySelector("div");
        if (container) container.style.transform = "rotate(0deg)";
      }
    }
  }, []);

  const centerOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lon], 16, {
        animate: true,
        duration: 0.5,
      });
      setIsFollowingUser(true);
    }
  };

  const toggleFollow = () => setIsFollowingUser((v) => !v);

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
            >
              <path
                d="M12 2v4M12 18v4M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M2 12h4M18 12h4M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
      />
    </div>
  );
};

export default DirectionsPage;
