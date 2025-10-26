"use client";
import React, { useEffect, useState } from "react";
import { getDistanceKm, getDistanceMeters } from "../../utils/distance";
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

  // ✅ Fetch nearby parking lots and calculate distances
  const fetchNearbyLots = async (coords, rangeKm) => {
    const { data: lots, error } = await supabase
      .from("parking_lots")
      .select("*");

    if (error) {
      console.error("Error fetching lots:", error);
      return;
    }

    // ✅ Filter + Add distance (in meters)
    const withDistance = lots
      .map((lot) => {
        const distance = getDistanceMeters(
          coords.lat,
          coords.lon,
          lot.lat,
          lot.lon
        );
        return { ...lot, distance };
      })
      .filter((lot) => lot.distance / 1000 <= rangeKm); // convert to km for filter

    // ✅ Sort by nearest first
    const sortedLots = withDistance.sort((a, b) => a.distance - b.distance);

    setNearbyLots(sortedLots);

    // Optional — for showing first image somewhere
    if (sortedLots.length > 0 && sortedLots[0].images?.length > 0) {
      setParkingImg(sortedLots[0].images[0]);
    }
  };

  // ✅ Choose between search coords or current location
  useEffect(() => {
    const init = async () => {
      if (lat && lon) {
        // User searched for a specific place
        const searchCoords = { lat, lon };
        setSelectedCoords(searchCoords);
        await fetchNearbyLots(searchCoords, radius);
      } else if (coords) {
        // Default: user's current location
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
