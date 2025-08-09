"use client";
import { useEffect, useRef, useState } from "react";

const page = () => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mapInstance = null;

    const initializeMap = () => {
      // Check if script is already loaded
      if (window.mappls && mapRef.current) {
        try {
          // Initialize map with proper configuration
          mapInstance = new window.mappls.Map(mapRef.current, {
            center: [22.5726, 88.3639], // Kolkata coordinates
            zoomControl: true,
            location: false, // Disable location control initially
            zoom: 12,
            clickableIcons: true,
          });

          // Wait for map to be ready
          mapInstance.addListener("load", () => {
            // Add marker after map loads
            new window.mappls.Marker({
              map: mapInstance,
              position: [22.5726, 88.3639],
              fitbounds: true,
            });
            setIsLoading(false);
          });
        } catch (err) {
          console.error("Map initialization error:", err);
          setError("Failed to initialize map");
          setIsLoading(false);
        }
      }
    };

    const loadMapScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="mappls.com"]'
      );
      if (existingScript) {
        if (window.mappls) {
          initializeMap();
        } else {
          existingScript.addEventListener("load", initializeMap);
        }
        return;
      }

      // Create and load script
      const script = document.createElement("script");
      script.src =
        "https://apis.mappls.com/advancedmaps/api/12ff7dbc2316b483c24ce71bc7068a56/map_sdk?layer=vector&v=3.0";
      script.async = true;

      script.onload = () => {
        // Add small delay to ensure mappls is fully loaded
        setTimeout(initializeMap, 100);
      };

      script.onerror = () => {
        setError("Failed to load map script");
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadMapScript();

    // Cleanup function
    return () => {
      if (mapInstance && typeof mapInstance.remove === "function") {
        try {
          mapInstance.remove();
        } catch (err) {
          console.warn("Error removing map:", err);
        }
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2>Map Preview</h2>
        <div
          style={{
            height: "500px",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
          }}
        >
          Loading map...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Map Preview</h2>
        <div
          style={{
            height: "500px",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Map Preview</h2>
      <div
        ref={mapRef}
        style={{
          height: "500px",
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default page;
