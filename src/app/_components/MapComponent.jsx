// components/MapComponent.js
"use client"; // This directive marks it as a Client Component

import { useEffect, useRef } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const MapComponent = () => {
  const mapRef = useRef(); // Ref to hold the map div

  useEffect(() => {
    // Create the OpenLayers map instance
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(), // Use OpenStreetMap as the base layer
        }),
      ],
      view: new View({
        center: [0, 0], // Initial center coordinates (longitude, latitude)
        zoom: 2, // Initial zoom level
      }),
      target: mapRef.current, // Target the div element
    });

    // Clean up the map on component unmount
    return () => map.setTarget(undefined);
  }, []); // Empty dependency array ensures it runs once on mount

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }}></div>;
};

export default MapComponent;
