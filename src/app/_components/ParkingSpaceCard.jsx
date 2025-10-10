"use client";
import { BatteryChargingIcon, Camera, Heart, MapIcon, Zap } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useAuthStore } from "../store/useAuthStore";
import { toggleFavourite } from "@/lib/updateFavourite";
import FavouriteLoginPop from "./FavouriteLoginPop";

const ParkingSpaceCard = ({ lot }) => {
  const { user, fetchUserData } = useAuthStore();
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Check if this space is already favourite
  useEffect(() => {
    if (user?.favourite?.includes(lot.id)) {
      setIsFav(true);
    }
  }, [user, lot.id]);

  const handleParkHere = () => {
    router.push(`/details/${lot.id}`);
  };

  const handleFavouriteClick = async () => {
    if (!user?.id) {
      setShowLoginPopup(true);
      return;
    }

    setIsFav(!isFav); // Optimistic UI

    const updatedFavs = await toggleFavourite(user.id, lot.id);
    if (updatedFavs) {
      await fetchUserData(user.id); // ✅ refresh user data in Zustand
    } else {
      setIsFav((prev) => !prev); // revert on failure
    }
  };

  return (
    <div className="w-full font-inter bg-white px-4">
      <div className="w-full min-h-[300px] overflow-hidden border shadow-lg/6 border-gray-100 rounded-xl bg-white">
        <div className="w-full h-[200px] overflow-hidden relative">
          <Swiper
            modules={[Navigation, Pagination]}
            pagination={true}
            slidesPerView={1}
            loop={true}
          >
            {lot.images.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="w-full overflow-hidden">
                  <Image
                    src={src || "/no-image.jpg"}
                    alt={`Slide ${index + 1}`}
                    width={600}
                    height={600}
                    layout="responsive"
                    fetchPriority="high"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute z-50 px-3 py-1 rounded-full left-2 top-2 bg-yellow-400 text-black">
            <p className="text-xs">20m Away</p>
          </div>

          <button
            onClick={handleFavouriteClick}
            className="bg-gray-200 z-50 p-2 rounded-full absolute right-2 top-2"
          >
            <Heart
              size={16}
              fill={isFav ? "red" : "none"}
              color={isFav ? "red" : "black"}
            />
          </button>
          <FavouriteLoginPop
            show={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
          />
        </div>

        <hr className="border-t border-dotted border-gray-300 my-2" />
        <div className="w-full p-2 overflow-x-auto">
          <div className="w-full flex justify-between items-start">
            <p className="font-semibold">{lot.name || "Unknown"}</p>
            <p className="font-semibold text-xl text-green-500">
              {lot.price_per_hour || "00 INR"}/hr
            </p>
          </div>

          <span className="w-full flex items-center gap-2">
            <MapIcon fill="yellow" size={16} />
            <p className="text-sm text-black/60">
              {lot.address || "No address available"}
            </p>
          </span>

          <hr className="border-t border-dotted border-gray-300 my-2" />

          <div className="w-full flex items-center justify-evenly">
            <span className="flex gap-1 items-center">
              <Zap size={16} fill="yellow" /> <p className="text-sm">Instant</p>
            </span>
            {lot.cctv && (
              <span className="flex gap-1 items-center">
                <Camera size={16} fill="yellow" />{" "}
                <p className="text-sm">CCTV Available</p>
              </span>
            )}
            {lot.ev_charging && (
              <span className="flex gap-1 items-center">
                <BatteryChargingIcon size={16} fill="yellow" />
                <p className="text-sm">EV Charging Available</p>
              </span>
            )}
          </div>

          <button
            onClick={handleParkHere}
            className="bg-yellow-400 w-full rounded-lg text-black py-3 mt-4 font-semibold"
          >
            Park Here!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingSpaceCard;
