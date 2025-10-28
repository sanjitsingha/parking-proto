"use client";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // If using navigation
import "swiper/css/pagination"; // If using pagination
import FavouriteLoginPop from "@/app/_components/FavouriteLoginPop";
import { toggleFavourite } from "@/lib/updateFavourite";
import {
  ArrowLeft,
  BadgeAlertIcon,
  BadgeCheckIcon,
  BatteryCharging,
  Camera,
  Cctv,
  CheckCircle2Icon,
  ChevronLeft,
  ChevronRight,
  Heart,
  IndianRupee,
  MapPin,
  Navigation2Icon,
  Star,
  TruckElectricIcon,
  Zap,
  ZapIcon,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import DetailPageSkeleton from "@/app/_components/DetailPageSkeleton";
import RequestPhoneNumber from "@/app/_components/RequestPhoneNumber";
import OpeningGoogleMap from "@/app/_components/OpeningGoogleMap";
import PreReserve from "@/app/_components/PreReserve";
import { useReserveStore } from "@/app/store/useReserveStore";
import Link from "next/link";
import PreReservePopup from "@/app/_components/PreReservePopup";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { user, fetchUserData } = useAuthStore();
  const supabase = createClientComponentClient();
  const [details, setDetails] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { setReserveDetails } = useReserveStore();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user?.favourite?.includes(id)) {
      setIsFav(true);
    }
  }, [user, id]);

  const handleFavouriteClick = async () => {
    if (!user?.id) {
      setShowLoginPopup(true);
      return;
    }
    setIsFav(!isFav);
    const updatedFavs = await toggleFavourite(user.id, id);
    if (updatedFavs) {
      await fetchUserData(user.id);
    } else {
      setIsFav((prev) => !prev);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data: row, error } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setDetails(row);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  //   Later on this loading witll changed to loading Animation, or shimmer efect
  if (!details) return <DetailPageSkeleton />;

  const handleNavigation = () => {
    setReserveDetails(details); // save the fetched details object in Zustand
    router.push("/pre-reserve");
  };

  console.log(details);

  return (
    <>
      <div className="w-full p-4">
        <div className="w-full h-fit py-3 ">
          <p className="font-inter font-semibold text-xl">{details.name}</p>
          <div className=" mt-1 font-inter flex justify-between items-center ">
            <p className="text-sm  text-black/60">{details.address}</p>
          </div>
        </div>
        {/* Custom arrows */}

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          navigation={{
            nextEl: "#custom-next",
            prevEl: "#custom-prev",
          }}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
        >
          <div
            className="absolute shadow-xl shadow-blue-dark  rounded-full p-1 bg-yellow/25 border border-yellow  top-1/2 left-2 z-10 cursor-pointer"
            id="custom-prev"
          >
            <ChevronLeft size={14} />
          </div>
          <div
            className="absolute  shadow-xl shadow-blue-dark rounded-full p-1 bg-yellow/25 border border-yellow top-1/2 right-2 z-10 cursor-pointer"
            id="custom-next"
          >
            <ChevronRight size={14} />
          </div>

          {/* Favourite Button  */}

          {details.images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="w-full   overflow-hidden rounded-xl h-[230px] relative">
                <button
                  onClick={handleFavouriteClick}
                  className="bg-gray-100 rounded-full  absolute right-2 top-2 flex  items-center gap-2 p-3"
                >
                  <Heart
                    fill={isFav ? "red" : "none"}
                    color={isFav ? "red" : "black"}
                    size={18}
                  />
                </button>
                <div className="bg-yellow rounded-full absolute px-3 text-sm left-2 top-2"></div>
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  width={400} // Set appropriate width
                  height={400} // Set appropriate height
                  layout="responsive" // Or other layout options
                  fetchPriority="high"
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pt-4 font-inter">
          <div className="w-full border-b flex items-center justify-between border-black/15 pb-2 ">
            <p className="text-xl font-bold  text-green-500">
              <span className="text-black">Price:</span>{" "}
              {details.price_per_hour} /hr
            </p>
            {details.status === "Active" && (
              <p className="text-sm bg-yellow-100 w-fit px-3 rounded-md border-yellow-200 text-yellow-500">
                {details.status}
              </p>
            )}
            {details.status === "Full" && (
              <p className="text-sm bg-red-100 w-fit px-3 rounded-md border-red-200 text-red-500">
                {details.status}
              </p>
            )}
          </div>
          <FavouriteLoginPop
            show={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
          />

          <div className="w-full mt-5">
            <h3 className=" my-3 font-semibold">Facilities</h3>
            {/* Features box */}
            <div className="w-full flex flex-col  gap-3 ">
              <p className="flex items-center gap-2 ">
                <Camera size={22} fill="#FDC700" /> CCTV Surveillance
              </p>
              <p className="flex items-center gap-2">
                <BatteryCharging size={22} fill="#FDC700" /> EV Charging
              </p>
              <p className="flex items-center gap-2">
                <ZapIcon size={22} fill="#FDC700" /> Instant
              </p>
            </div>
          </div>
          <RequestPhoneNumber />
          <div className="w-full mt-4  ">
            <p className="font-semibold">Descriptions:</p>
            <p className="text-xs mt-3">{details.description}</p>
          </div>
          <div className="w-full pb-30 mt-4">
            <div className="w-full bg-green-400/10 border p-2 rounded-md border-green-400 ">
              <span className="text-green-500 flex items-center gap-2">
                <p>Do's</p>
                <BadgeCheckIcon size={16} />
              </span>
              <div className="w-full text-black/60 text-sm mt-2 flex flex-col gap-1">
                <p>Park properly inside the marked area.</p>
                <p>Lock your vehicle and keep valuables safe.</p>
              </div>
            </div>
            <div className="w-full bg-red-400/10 border p-2 mt-2 rounded-md border-red-400 ">
              <span className="text-red-500 flex items-center gap-2">
                <p>Don't</p>
                <BadgeAlertIcon size={16} />
              </span>
              <div className="w-full text-black/60 text-sm mt-2 flex flex-col gap-1">
                <p>Park properly inside the marked area.</p>
                <p>Lock your vehicle and keep valuables safe.</p>
              </div>
            </div>
          </div>

          <div className="w-full fixed bottom-0 left-0 bg-blue-dark p-2 pb-10 pt-4 z-30">
            <button
              onClick={() => setShowPopup(true)}
              className="w-full rounded-full text-black min-h-[45px] flex items-center gap-2 justify-center mb-3 bg-yellow-400"
            >
              <Navigation2Icon size={18} fill="black" /> Start Navigation
            </button>

            {showPopup && (
              <PreReservePopup
                user={user}
                details={details}
                onClose={() => setShowPopup(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
