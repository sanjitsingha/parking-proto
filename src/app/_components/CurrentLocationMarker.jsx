"use client";
import L from "leaflet";

// Custom marker (you can replace with your own image/SVG)
export const CurrentLocationIcon = new L.DivIcon({
  html: `
    <div style="
      background: #2563eb;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px rgba(37, 99, 235, 0.7);
    "></div>
  `,
  className: "", // disable default Leaflet styles
  iconSize: [20, 20],
  iconAnchor: [10, 10], // center the circle
});
