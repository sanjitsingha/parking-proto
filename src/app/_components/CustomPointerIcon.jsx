import L from "leaflet";

export const CustomPointerIcon = L.divIcon({
  className: "custom-pointer-icon",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: red;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 8px rgba(255,0,0,0.8);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
