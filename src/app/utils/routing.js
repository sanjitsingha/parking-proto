"use client";

import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import Polyline from "ol/format/Polyline";

// Async function to fetch a route from the OSRM API.
export const getRouteFeature = async (start, destination) => {
  const startPoint = `${start.lng},${start.lat}`;
  const endPoint = `${destination.lng},${destination.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${startPoint};${endPoint}?overview=full&geometries=polyline`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const encodedPolyline = data.routes[0].geometry;

      // Decode the polyline into a LineString feature.
      const routeCoordinates = new Polyline({
        factor: 1e5,
      }).readGeometry(encodedPolyline, {
        dataProjection: "EPSG:4326", // WGS84, standard for GPS
        featureProjection: "EPSG:3857", // Web Mercator, used by OpenLayers
      });

      return new Feature({
        geometry: routeCoordinates,
      });
    }
    return null;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
};
