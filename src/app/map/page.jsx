"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../_components/MapComponent"), {
  ssr: false, // 👈 disables SSR for Leaflet
});

export default function Page() {
  return <Map />;
}
