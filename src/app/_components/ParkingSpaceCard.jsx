import {
  BatteryChargingIcon,
  Camera,
  Heart,
  Map,
  MapIcon,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // If using navigation
import "swiper/css/pagination"; // If using pagination

const ParkingSpaceCard = ({ lot }) => {
  const router = useRouter();
  const [selectedLot, setselectedLot] = useState(null);

  const handleParkHere = () => {
    router.push(`/details/${lot.id}`);
  };

  console.log(lot.images);
  return (
    <>
      <div className="w-full font-inter  bg-white p-4">
        <div className="w-full min-h-[300px] overflow-hidden border shadow-lg/6 border-gray-100 rounded-xl bg-white ">
          <div className="w-full h-[200px] overflow-hidden relative">
            {/* image div */}
            <Swiper
              modules={[Navigation, Pagination]}
              pagination
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

            <div className="absolute z-99 px-3 py-1 rounded-full left-2 top-2 bg-yellow-400 text-black">
              <p className="text-xs">20m Away</p>
            </div>
            <button className="bg-gray-200 z-80 p-2 rounded-full absolute right-2 top-2">
              <Heart size={16} />
            </button>
          </div>
          <hr className="border-t border-dotted border-gray-300 my-2" />
          <div className="w-full p-2 overflow-x-auto">
            <div className="w-full flex justify-between items-start">
              <p className="font-semibold">{lot.name || "Unknown"}</p>
              <p className="font-semibold text-xl text-green-500">
                {lot.price_per_hour || "00  INR"}/hr
              </p>
            </div>

            <span className="w-full flex items-center gap-2">
              <MapIcon fill="yellow" size={16} />
              <p className="text-sm text-black/60">
                {lot.address || "No address available"}
              </p>
            </span>
            <hr className="border-t border-dotted border-gray-300 my-2" />

            <div className="w-full flex items-center justify-evenly ">
              {/* Facilities Box */}

              <span className="flex gap-1 items-center">
                <Zap size={16} fill="yellow" />{" "}
                <p className="text-sm">Instant</p>
              </span>
              {lot.cctv ? (
                <span className="flex gap-1 items-center">
                  <Camera size={16} fill="yellow" />{" "}
                  <p className="text-sm">CCTV Available</p>
                </span>
              ) : null}
              {lot.ev_charging ? (
                <span className="flex gap-1 items-center">
                  <BatteryChargingIcon size={16} fill="yellow" />
                  <p className="text-sm">EV Charging Available</p>
                </span>
              ) : null}
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
    </>
  );
};

export default ParkingSpaceCard;
