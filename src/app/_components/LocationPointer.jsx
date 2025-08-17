"use client";
import { Marker } from "react-leaflet";
import { CustomPointerIcon } from "./CustomPointerIcon";

const LocationPointer = ({ coordinates }) => {
  if (!coordinates) return null;

  return (
    <Marker
      position={[coordinates.lat, coordinates.lng]}
      icon={CustomPointerIcon}
    />
  );
};

export default LocationPointer;
