"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // If using navigation
import "swiper/css/pagination"; // If using pagination

import {
  ArrowLeft,
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

const page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const supabase = createClientComponentClient();
  const [details, setDetails] = useState(null);

  const handleGoBack = () => {
    router.back();
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
  if (!details) return <p>Loading...</p>;

  return (
    <div className="w-full p-4">
      <div className="w-full h-fit py-3 ">
        <p className="font-inter font-semibold text-xl">{details.name}</p>
        <div className=" mt-1 font-inter flex justify-between items-center ">
          <p className="text-sm  text-black/60">{details.address}</p>
          <p className="text-sm bg-yellow-100 w-fit px-3 rounded-md border-yellow-200 text-yellow-500">
            {details.status}
          </p>
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
          className="absolute rounded-full p-2 bg-white  top-1/2 left-2 z-10 cursor-pointer"
          id="custom-prev"
        >
          <ChevronLeft />
        </div>
        <div
          className="absolute rounded-full p-2 bg-white top-1/2 right-2 z-10 cursor-pointer"
          id="custom-next"
        >
          <ChevronRight />
        </div>
        {details.images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full   overflow-hidden rounded-2xl h-[200px] relative">
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
          <p className="text-2xl font-bold  text-green-500">
            <span className="text-black">Price:</span> {details.price_per_hour}{" "}
            /hr
          </p>
          <button className="bg-gray-100 rounded-full  flex  items-center gap-2 p-3">
            <Heart color="red" size={18} />
          </button>
        </div>

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

        <div className="w-full mt-4  ">
          <p className="font-semibold">Descriptions:</p>
          <p className="text-xs mt-3">{details.description}</p>
        </div>
        <div className="w-full fixed bottom-0 bg-white left-0 p-2 ">
          <button className="w-full rounded-full text-black h-[45px] flex items-center gap-2 justify-center mb-3 bg-yellow-400">
            <Navigation2Icon size={18} fill="black" /> Start Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
