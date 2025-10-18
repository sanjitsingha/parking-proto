"use client";
import { Navigation, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CurrentLocationParking from "../_components/CurrentLocationParking";
import ExplorePageSkeleton from "../_components/ExplorePageSkeleton";

const page = () => {
  const router = useRouter();
  const [locationPermission, setlocationPermission] = useState(null);

  return (
    <div className="font-inter h-[100vh]">
      <div className="w-full h-[calc(100vh-90px)] overflow-y-auto">
        <div className="w-full h-fit pt-4 pb-6 px-4 bg-[#18191F]">
          <div className="w-full">
            <h1 className="text-3xl font-semibold leading-9 text-white">
              <span className="text-lg font-medium text-yellow-400">
                Where ever you go
              </span>{" "}
              <br />
              Parking follows!
            </h1>
          </div>
        </div>

        {/* Sticky Search Bar */}
        <div className="w-full sticky top-0 z-10 bg-[#18191F] p-4 pt-2">
          <div className="flex gap-2">
            <input
              className="bg-white flex-1 border-yellow-400 border outline-none px-3 h-[46px] rounded-md"
              type="text"
              placeholder="Search for a Location?"
            />
            <button className="h-[46px] rounded-md px-4 bg-yellow-400">
              Go
            </button>
          </div>
        </div>

        {/* Location permission */}
        <div className="w-full hidden bg-[#24262e] p-4 flex-col items-center h-full text-center gap-6">
          <p className="font-semibold text-white text-xl">Enable Location</p>
          <div className="bg-[#18191F] p-6 rounded-full">
            <Navigation className="text-white mx-auto" size={60} />
          </div>
          <p className="text-white/60 text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum
            accusantium adipisci impedit.
          </p>
          <button className="bg-yellow-400 px-6 py-3 rounded-full">
            Allow Location
          </button>
        </div>
        <CurrentLocationParking />
        {/* <ExplorePageSkeleton /> */}
      </div>
    </div>
  );
};

export default page;
