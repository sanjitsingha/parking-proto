"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// OpenLayers core + styles
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Icon, Stroke } from "ol/style";
import Polyline from "ol/format/Polyline";

/**
 * DirectionsPage (refactored)
 * - Validates URL params (lat/lng)
 * - Gets high-accuracy live location with watchPosition
 * - Draws destination marker (red) + current marker (blue)
 * - Fetches & renders driving route via OSRM (polyline6)
 * - "Start Navigation" enables follow mode (smooth pan to user)
 * - "View on Google Maps" opens native directions
 * - No flicker: markers/layers created once; only geometries are updated
 */
export default function DirectionsPage() {
  const mapEl = useRef(null);
  const mapRef = useRef(/** @type {Map|null} */ (null));

  const searchParams = useSearchParams();
  const router = useRouter();

  // === Parse and validate destination ===
  const dest = useMemo(() => {
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    return null;
  }, [searchParams]);

  // === UI state ===
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // === Live location (watch) ===
  const [userLL, setUserLL] = useState(null); // {lat,lng}
  const lastCoordsRef = useRef(null);

  // Smoothing factor for position updates (0..1). Higher = snappier, Lower = smoother
  const ALPHA = 0.35;

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setPermissionError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    const opts = { enableHighAccuracy: true, timeout: 8000, maximumAge: 1000 };

    const onSuccess = (pos) => {
      const fresh = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      // Exponential smoothing to avoid jitter/flicker
      if (lastCoordsRef.current) {
        const prev = lastCoordsRef.current;
        const smooth = {
          lat: prev.lat + ALPHA * (fresh.lat - prev.lat),
          lng: prev.lng + ALPHA * (fresh.lng - prev.lng),
        };
        lastCoordsRef.current = smooth;
        setUserLL(smooth);
      } else {
        lastCoordsRef.current = fresh;
        setUserLL(fresh);
      }
      setLoading(false);
    };

    const onError = (err) => {
      console.error("Geolocation error:", err);
      setPermissionError(err?.message || "Failed to get location");
      setLoading(false);
    };

    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      opts
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // === Vector sources & layers created once ===
  const routeSourceRef = useRef(new VectorSource());
  const markerSourceRef = useRef(new VectorSource());
  const routeLayerRef = useRef(
    new VectorLayer({
      source: routeSourceRef.current,
      style: new Style({
        stroke: new Stroke({ color: "#2563eb", width: 5 }), // blue path
      }),
      zIndex: 5,
    })
  );
  const markerLayerRef = useRef(
    new VectorLayer({ source: markerSourceRef.current, zIndex: 10 })
  );

  // === Marker features created once and re-used ===
  const userFeatureRef = useRef(new Feature());
  const destFeatureRef = useRef(new Feature());

  // SVG icons (embedded) — blue for user, red for destination
  const userIcon = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">\n  <circle cx="14" cy="14" r="10" fill="#3B82F6"/>\n  <circle cx="14" cy="14" r="4" fill="white"/>\n</svg>'
      )}`,
    []
  );
  const destIcon = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">\n  <circle cx="14" cy="14" r="10" fill="#EF4444"/>\n  <circle cx="14" cy="14" r="4" fill="white"/>\n</svg>'
      )}`,
    []
  );

  // Apply styles once
  useEffect(() => {
    userFeatureRef.current.setStyle(
      new Style({
        image: new Icon({ src: userIcon, scale: 1, anchor: [0.5, 0.5] }),
      })
    );
    destFeatureRef.current.setStyle(
      new Style({
        image: new Icon({ src: destIcon, scale: 1.1, anchor: [0.5, 0.9] }),
      })
    );
  }, [userIcon, destIcon]);

  // === Initialize map once ===
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    const map = new Map({
      target: mapEl.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        routeLayerRef.current,
        markerLayerRef.current,
      ],
      view: new View({ center: fromLonLat([88.3639, 22.5726]), zoom: 14 }), // default to Kolkata-ish until we have coords
    });

    // Add features to layer source
    markerSourceRef.current.addFeature(userFeatureRef.current);
    markerSourceRef.current.addFeature(destFeatureRef.current);

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  // === Place destination marker when dest is valid ===
  useEffect(() => {
    if (!dest || !mapRef.current) return;
    const destXY = fromLonLat([dest.lng, dest.lat]);
    destFeatureRef.current.setGeometry(new Point(destXY));

    // If we don't have user yet, center on destination first
    if (!userLL) {
      mapRef.current
        .getView()
        .animate({ center: destXY, zoom: 15, duration: 400 });
    }
  }, [dest, userLL]);

  // === Update user marker + optionally follow ===
  useEffect(() => {
    if (!userLL || !mapRef.current) return;
    const xy = fromLonLat([userLL.lng, userLL.lat]);
    userFeatureRef.current.setGeometry(new Point(xy));

    if (isFollowing) {
      mapRef.current.getView().animate({ center: xy, duration: 250 });
    }
  }, [userLL, isFollowing]);

  // === Fetch route from OSRM and render ===
  const fetchAndDrawRoute = useCallback(async (fromLL, toLL) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromLL.lng},${fromLL.lat};${toLL.lng},${toLL.lat}?overview=full&geometries=polyline6`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM error ${res.status}`);
      const data = await res.json();
      const poly = data?.routes?.[0]?.geometry;
      if (!poly) throw new Error("No route geometry found");

      // Decode polyline6 into a LineString in the map projection
      const format = new Polyline({ factor: 1e6 });
      const geom = format.readGeometry(poly, {
        dataProjection: "EPSG:4326",
        featureProjection: mapRef.current.getView().getProjection(),
      });

      // Replace any existing route feature
      routeSourceRef.current.clear();
      routeSourceRef.current.addFeature(new Feature({ geometry: geom }));

      // Fit map to route with padding
      mapRef.current
        .getView()
        .fit(geom, { padding: [60, 60, 60, 60], duration: 400, maxZoom: 17 });
    } catch (e) {
      console.error(e);
      // Soft fail, keep markers only
    }
  }, []);

  // Draw/refresh route whenever we have both points (user + dest)
  useEffect(() => {
    if (userLL && dest) fetchAndDrawRoute(userLL, dest);
  }, [userLL, dest, fetchAndDrawRoute]);

  // === Actions ===
  const onStart = () => setIsFollowing(true);
  const onStop = () => setIsFollowing(false);
  const onOpenGoogle = () => {
    if (!dest || !userLL) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLL.lat},${userLL.lng}&destination=${dest.lat},${dest.lng}`;
    window.open(url, "_blank");
  };
  const onRecenter = () => {
    if (!userLL || !mapRef.current) return;
    mapRef.current.getView().animate({
      center: fromLonLat([userLL.lng, userLL.lat]),
      duration: 300,
      zoom: Math.max(mapRef.current.getView().getZoom() || 16, 16),
    });
  };

  // === Guards ===
  if (!dest) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 bg-gray-50 px-4 text-center">
        <h1 className="text-xl font-semibold text-red-600">
          Invalid destination coordinates
        </h1>
        <p className="text-gray-600">
          Missing or malformed <code>lat</code>/<code>lng</code> in the URL.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (permissionError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 bg-gray-50 px-4 text-center">
        <h1 className="text-xl font-semibold text-red-600">
          Location permission problem
        </h1>
        <p className="text-gray-600">{permissionError}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (loading || !userLL) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-700 animate-pulse">
          Getting your live location…
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Map container */}
      <div ref={mapEl} className="w-full h-full" />

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
        {!isFollowing ? (
          <button
            onClick={onStart}
            className="pointer-events-auto bg-green-600 text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-green-700"
          >
            Start Navigation
          </button>
        ) : (
          <button
            onClick={onStop}
            className="pointer-events-auto bg-gray-700 text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-gray-800"
          >
            Stop Following
          </button>
        )}
        <button
          onClick={onRecenter}
          className="pointer-events-auto bg-white text-gray-900 font-semibold py-3 px-5 rounded-full shadow-md hover:bg-gray-100 border"
        >
          Recenter
        </button>
        <button
          onClick={onOpenGoogle}
          className="pointer-events-auto bg-blue-600 text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-blue-700"
        >
          Open in Google Maps
        </button>
      </div>
    </div>
  );
}
