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

const CurrentLocationParking = () => {
  const { user } = useAuthStore();
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 10000,
    });
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [nearbyLots, setNearbyLots] = useState([]);
  const { setSelectedLot } = useParkingStore();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // ✅ Removed setparkingImg from render — use state only if needed later
  const [parkingImg, setParkingImg] = useState(null);

  const fetchNearbyLots = async (coords) => {
    const { data: lots, error } = await supabase
      .from("parking_lots")
      .select("*");

    if (error) {
      console.error("Error fetching lots:", error);
      return;
    }

    const nearby = lots.filter((lot) => {
      const distance = getDistanceKm(coords.lat, coords.lon, lot.lat, lot.lon);
      return distance <= 5;
    });

    setNearbyLots(nearby);

    // If you want to save first image from the first lot
    if (nearby.length > 0 && nearby[0].images?.length > 0) {
      setParkingImg(nearby[0].images[0]);
    }
  };

  useEffect(() => {
    if (coords) {
      const userCoords = {
        lat: coords.latitude,
        lon: coords.longitude,
      };
      setSelectedCoords(userCoords);
      fetchNearbyLots(userCoords);
    } else if (!isGeolocationAvailable) {
      alert("Your browser does not support Geolocation");
    } else if (!isGeolocationEnabled) {
      alert("Please enable location permissions to find nearby parking");
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  //  Old One of fetching location
  // useEffect(() => {
  //   handleGetCurrentLocation();
  // }, []);

  // const handleGetCurrentLocation = async () => {
  //   if (!navigator.geolocation) {
  //     alert("Geolocation not supported");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     async (pos) => {
  //       const coords = {
  //         lat: pos.coords.latitude,
  //         lon: pos.coords.longitude,
  //       };
  //       setSelectedCoords(coords);
  //       await fetchNearbyLots(coords);
  //     },
  //     (err) => {
  //       console.error("Location error:", err);
  //       alert("Permission denied or error getting location");
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 5000,
  //     }
  //   );
  // };

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
    <>
      <div>
        <div className="w-full px-4 py-3 flex gap-2 justify-center">
          <p className="text-xs text-black/40">
            {nearbyLots.length + " Result Found  |  1KM Radius"}{" "}
          </p>
        </div>
        {nearbyLots.length > 0 && (
          <div className="  mb-2 rounded-md">
            {nearbyLots.map((lot) => (
              <ParkingSpaceCard key={lot.id} lot={lot} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentLocationParking;
