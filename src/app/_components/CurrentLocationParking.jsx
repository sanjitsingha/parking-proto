"use client";
import React, { useEffect, useState } from "react";
import { getDistanceKm } from "../../utils/distance";
import { useRouter } from "next/navigation";
import { useParkingStore } from "../store/useParkingStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ParkingSpaceCard from "./ParkingSpaceCard";
import ExplorePageSkeleton from "./ExplorePageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useGeolocated } from "react-geolocated";

const CurrentLocationParking = ({ lat, lon, radius = 1 }) => {
  const { user } = useAuthStore();
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: { enableHighAccuracy: true },
      userDecisionTimeout: 10000,
    });

  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nearbyLots, setNearbyLots] = useState([]);
  const [parkingImg, setParkingImg] = useState(null);

  const { setSelectedLot } = useParkingStore();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // ✅ Fetch nearby parking lots based on given coordinates
  const fetchNearbyLots = async (coords, rangeKm) => {
    const { data: lots, error } = await supabase
      .from("parking_lots")
      .select("*");

    if (error) {
      console.error("Error fetching lots:", error);
      return;
    }

    const nearby = lots.filter((lot) => {
      const distance = getDistanceKm(coords.lat, coords.lon, lot.lat, lot.lon);
      return distance <= rangeKm;
    });

    setNearbyLots(nearby);

    if (nearby.length > 0 && nearby[0].images?.length > 0) {
      setParkingImg(nearby[0].images[0]);
    }
  };

  // ✅ Detect whether props or current location should be used
  useEffect(() => {
    const init = async () => {
      if (lat && lon) {
        // Search result coordinates (from ExplorePage)
        const searchCoords = { lat, lon };
        setSelectedCoords(searchCoords);
        await fetchNearbyLots(searchCoords, radius);
      } else if (coords) {
        // Current location fallback
        const current = { lat: coords.latitude, lon: coords.longitude };
        setSelectedCoords(current);
        await fetchNearbyLots(current, 1);
      } else if (!isGeolocationAvailable) {
        alert("Your browser does not support Geolocation");
      } else if (!isGeolocationEnabled) {
        alert("Please enable location permissions to find nearby parking");
      }
    };

    init();
  }, [lat, lon, coords, radius, isGeolocationAvailable, isGeolocationEnabled]);

  const handleSelectLot = (lot) => {
    setSelectedLot(lot);
    if (selectedCoords) {
      router.push(
        `/directions?lat=${selectedCoords.lat}&lon=${selectedCoords.lon}`
      );
    } else {
      alert("Please get your current location first");
    }
  };

  if (!nearbyLots || nearbyLots.length === 0) {
    return <ExplorePageSkeleton />;
  }

  return (
    <div>
      <div className="w-full px-4 py-3 flex gap-2 justify-center">
        <p className="text-xs text-black/40">
          {nearbyLots.length} Result Found |{" "}
          {lat && lon
            ? `${radius}KM Radius (Search Area)`
            : "1KM Radius (Nearby)"}
        </p>
      </div>

      <div className="mb-2 rounded-md">
        {nearbyLots.map((lot) => (
          <ParkingSpaceCard
            key={lot.id}
            lot={lot}
            onClick={() => handleSelectLot(lot)}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentLocationParking;
